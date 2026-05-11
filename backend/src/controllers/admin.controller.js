const bcrypt = require('bcryptjs');
const Joi    = require('joi');
const db     = require('../config/database');
const pdfService   = require('../services/pdf.service');
const excelService = require('../services/excel.service');

const validate = (schema, data) => {
  const { error, value } = schema.validate(data, { abortEarly: false });
  if (error) throw Object.assign(new Error(error.details.map(d => d.message).join(', ')), { status: 400 });
  return value;
};

// ── GET /types-parking ────────────────────────────────────────────────────────
exports.getTypesParkings = async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT id_type_parking, name FROM types_parking ORDER BY id_type_parking');
    res.json(rows);
  } catch (err) { next(err); }
};

// ── GET /cities ───────────────────────────────────────────────────────────────
exports.getCities = async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT id_city, name FROM cities ORDER BY name');
    res.json(rows);
  } catch (err) { next(err); }
};

// ── GET /schedules ────────────────────────────────────────────────────────────
exports.getSchedules = async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT * FROM schedules ORDER BY id_schedule');
    res.json(rows);
  } catch (err) { next(err); }
};

// ── POST /register-administrator ──────────────────────────────────────────────
exports.registerAdministrator = async (req, res, next) => {
  const client = await db.pool.connect();
  try {
    const value = validate(Joi.object({
      user_name:           Joi.string().alphanum().min(3).max(50).required(),
      first_name:          Joi.string().min(2).max(100).required(),
      last_name:           Joi.string().min(2).max(100).required(),
      identification_card: Joi.string().min(5).max(20).required(),
      password:            Joi.string().min(8).max(100).required(),
      mail:                Joi.string().email().required(),
      role:                Joi.string().valid('Administrador').required(),
    }), req.body);

    const dup = await client.query(
      'SELECT id_user FROM users WHERE user_name=$1 OR mail=$2',
      [value.user_name, value.mail]
    );
    if (dup.rows.length) return res.status(409).json({ error: 'El usuario o correo ya existe' });

    const roleRes = await client.query("SELECT id_role FROM roles WHERE name='Administrador'");
    const hashed  = await bcrypt.hash(value.password, 12);

    await client.query('BEGIN');
    const userRes = await client.query(
      `INSERT INTO users (first_name,last_name,user_name,mail,password,identification_card,is_active,mail_verified,id_role_fk)
       VALUES ($1,$2,$3,$4,$5,$6,true,true,$7) RETURNING id_user`,
      [value.first_name, value.last_name, value.user_name, value.mail,
       hashed, value.identification_card, roleRes.rows[0].id_role]
    );
    await client.query(
      'INSERT INTO user_controllers (is_account_blocked, failed_attempts, id_user_fk) VALUES (false,0,$1)',
      [userRes.rows[0].id_user]
    );
    await client.query('COMMIT');

    res.status(201).json({ message: 'Administrador registrado exitosamente' });
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    next(err);
  } finally { client.release(); }
};

// ── GET /records ──────────────────────────────────────────────────────────────
exports.getRecords = async (req, res, next) => {
  try {
    const { q = '', startDate, endDate } = req.query;

    let conditions = [];
    let params     = [];
    let idx        = 1;

    if (q) {
      conditions.push(`(u.user_name ILIKE $${idx} OR r.action ILIKE $${idx} OR r.ip_user ILIKE $${idx})`);
      params.push(`%${q}%`);
      idx++;
    }
    if (startDate) {
      conditions.push(`r.date >= $${idx}`);
      params.push(startDate);
      idx++;
    }
    if (endDate) {
      conditions.push(`r.date <= $${idx}`);
      params.push(endDate);
      idx++;
    }

    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';

    const { rows } = await db.query(
      `SELECT r.id_record, r.action, r.date, r.time, r.ip_user, r.id_user_fk,
              json_build_object('user_name', u.user_name) AS users
       FROM records r
       LEFT JOIN users u ON u.id_user = r.id_user_fk
       ${where}
       ORDER BY r.created_at DESC
       LIMIT 500`,
      params
    );
    res.json(rows);
  } catch (err) { next(err); }
};

// ── Helpers para estadísticas ─────────────────────────────────────────────────

const buildStatFilters = (body, startIdx = 1) => {
  const { startDate, endDate, id_parkig_fk, id_city_fk } = body;
  const conditions = [];
  const params = [];
  let idx = startIdx;

  if (startDate) { conditions.push(`r.reservation_date >= $${idx++}`); params.push(startDate); }
  if (endDate)   { conditions.push(`r.reservation_date <= $${idx++}`); params.push(endDate); }
  if (id_parkig_fk) { conditions.push(`r.id_parking_fk = $${idx++}`); params.push(id_parkig_fk); }
  if (id_city_fk)   { conditions.push(`p.id_city_fk = $${idx++}`);   params.push(id_city_fk); }

  return { conditions, params };
};

const getStatsData = async (where, params) => {
  const joinParking = where.includes('p.id_city_fk')
    ? 'LEFT JOIN parkings p ON p.id_parking = r.id_parking_fk'
    : '';

  // Ingresos por día de semana
  const dayQuery = await db.query(
    `SELECT EXTRACT(DOW FROM r.reservation_date) AS dow,
            COALESCE(SUM(i.total_amount),0) AS total
     FROM reservations r
     LEFT JOIN invoices i ON i.id_reservation_fk = r.id_reservation
     ${joinParking}
     ${where}
     GROUP BY dow`,
    params
  );
  const dayMap = { 1:'lunes',2:'martes',3:'miércoles',4:'jueves',5:'viernes',6:'sábado',0:'domingo' };
  const countEarningByDays = { lunes:0,martes:0,'miércoles':0,jueves:0,viernes:0,sábado:0,domingo:0 };
  for (const row of dayQuery.rows) {
    const name = dayMap[parseInt(row.dow)];
    if (name) countEarningByDays[name] = parseFloat(row.total);
  }

  // Estadísticas generales
  const genQuery = await db.query(
    `SELECT COALESCE(SUM(i.total_amount),0) AS total_revenue,
            COALESCE(SUM(i.time),0) AS total_hours,
            COUNT(CASE WHEN r.state='Finalizada' THEN 1 END) AS finished,
            COUNT(CASE WHEN r.state='Cancelada'  THEN 1 END) AS canceled
     FROM reservations r
     LEFT JOIN invoices i ON i.id_reservation_fk = r.id_reservation
     ${joinParking}
     ${where}`,
    params
  );
  const gen = genQuery.rows[0];

  // Reservas por hora
  const hourQuery = await db.query(
    `SELECT EXTRACT(HOUR FROM r.entry_reservation_date) AS hora,
            COUNT(*) AS reservas
     FROM reservations r
     ${joinParking}
     ${where}
     GROUP BY hora ORDER BY hora`,
    params
  );

  return {
    countEarningByDays,
    getGeneralStatics: {
      totalRevenue:          parseFloat(gen.total_revenue),
      totalHours:            parseFloat(gen.total_hours),
      finishedReservations:  parseInt(gen.finished),
      canceledReservations:  parseInt(gen.canceled),
    },
    countReservationByHour: hourQuery.rows.map(r => ({
      hora:     parseInt(r.hora),
      reservas: parseInt(r.reservas),
    })),
  };
};

// ── POST /statistics-admin ────────────────────────────────────────────────────
exports.statisticsAdmin = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.body;
    const params = [];
    const conditions = [];
    let idx = 1;

    if (startDate) { conditions.push(`r.reservation_date >= $${idx++}`); params.push(startDate); }
    if (endDate)   { conditions.push(`r.reservation_date <= $${idx++}`); params.push(endDate); }

    // Administrador solo ve su propio parqueadero
    if (req.user.role === 'Administrador') {
      conditions.push(`r.id_parking_fk IN (SELECT id_parking FROM parkings WHERE id_user_fk=$${idx++})`);
      params.push(req.user.id_user);
    }

    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
    const data  = await getStatsData(where, params);
    res.json(data);
  } catch (err) { next(err); }
};

// ── POST /statistics-pdf ──────────────────────────────────────────────────────
exports.statisticsPdf = async (req, res, next) => {
  try {
    validate(Joi.object({
      startDate:     Joi.string().optional(),
      endDate:       Joi.string().optional(),
      type:          Joi.string().optional(),
      id_parkig_fk:  Joi.number().integer().optional(),
      id_city_fk:    Joi.number().integer().optional(),
    }), req.body);

    const { conditions, params } = buildStatFilters(req.body);
    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
    const data  = await getStatsData(where, params);

    const pdfBuffer = await pdfService.generateStatsPdf(data, req.body);

    res.set({
      'Content-Type':        'application/pdf',
      'Content-Disposition': 'inline; filename="estadisticas-fourpark.pdf"',
    });
    res.send(pdfBuffer);
  } catch (err) { next(err); }
};

// ── POST /statistics-excel ────────────────────────────────────────────────────
exports.statisticsExcel = async (req, res, next) => {
  try {
    validate(Joi.object({
      startDate:     Joi.string().optional(),
      endDate:       Joi.string().optional(),
      type:          Joi.string().optional(),
      id_parkig_fk:  Joi.number().integer().optional(),
      id_city_fk:    Joi.number().integer().optional(),
    }), req.body);

    const { conditions, params } = buildStatFilters(req.body);
    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
    const data  = await getStatsData(where, params);

    const buffer = await excelService.generateStatsExcel(data, req.body);

    res.set({
      'Content-Type':        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'inline; filename="estadisticas-fourpark.xlsx"',
    });
    res.send(buffer);
  } catch (err) { next(err); }
};
