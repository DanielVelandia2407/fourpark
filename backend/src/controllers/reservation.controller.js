const Joi  = require('joi');
const { v4: uuidv4 } = require('uuid');
const db   = require('../config/database');
const emailService = require('../services/email.service');

const validate = (schema, data) => {
  const { error, value } = schema.validate(data, { abortEarly: false });
  if (error) throw Object.assign(new Error(error.details.map(d => d.message).join(', ')), { status: 400 });
  return value;
};

const RESERVATION_SELECT = `
  SELECT r.*,
         u.user_name,
         p.name AS parking_name, p.has_loyalty_service, p.image_path AS parking_image,
         v.name AS vehicle_name,
         inv.id_invoice, inv.reserve_amount, inv.service_amount, inv.extra_time_amount,
         inv.refund_amount, inv.total_amount, inv.time AS invoice_time,
         inv.payment_token, inv.id_payment_method_fk
  FROM reservations r
  LEFT JOIN users u ON u.id_user = r.id_user_fk
  LEFT JOIN parkings p ON p.id_parking = r.id_parking_fk
  LEFT JOIN vehicles v ON v.id_vehicle = r.id_vehicle_fk
  LEFT JOIN invoices inv ON inv.id_reservation_fk = r.id_reservation
`;

const formatReservation = (row) => ({
  id_reservation:              row.id_reservation,
  reservation_date:            row.reservation_date,
  entry_reservation_date:      row.entry_reservation_date,
  departure_reservation_date:  row.departure_reservation_date,
  check_in:                    row.check_in,
  check_out:                   row.check_out,
  vehicle_code:                row.vehicle_code,
  state:                       row.state,
  id_vehicle_fk:               row.id_vehicle_fk,
  id_user_fk:                  row.id_user_fk,
  id_parking_fk:               row.id_parking_fk,
  users:    { user_name: row.user_name },
  parkings: { name: row.parking_name, has_loyalty_service: row.has_loyalty_service, image_path: row.parking_image },
  vehicles: { name: row.vehicle_name },
  invoices: row.id_invoice ? {
    id_invoice:           row.id_invoice,
    reserve_amount:       parseFloat(row.reserve_amount),
    service_amount:       parseFloat(row.service_amount),
    extra_time_amount:    parseFloat(row.extra_time_amount),
    refund_amount:        parseFloat(row.refund_amount),
    total_amount:         parseFloat(row.total_amount),
    time:                 parseFloat(row.invoice_time),
    payment_token:        row.payment_token,
    id_payment_method_fk: row.id_payment_method_fk,
    id_reservation_fk:    row.id_reservation,
  } : null,
});

// ── GET /reservations ─────────────────────────────────────────────────────────
exports.getReservations = async (req, res, next) => {
  try {
    let query  = RESERVATION_SELECT;
    let params = [];

    if (req.user.role === 'Usuario') {
      query  += ' WHERE r.id_user_fk=$1';
      params  = [req.user.id_user];
    } else if (req.user.role === 'Administrador') {
      query  += ' WHERE r.id_parking_fk IN (SELECT id_parking FROM parkings WHERE id_user_fk=$1)';
      params  = [req.user.id_user];
    }
    // SuperAdministrador: sin filtro

    query += ' ORDER BY r.reservation_date DESC';
    const { rows } = await db.query(query, params);
    res.json(rows.map(formatReservation));
  } catch (err) { next(err); }
};

// ── POST /reservations ────────────────────────────────────────────────────────
exports.createReservation = async (req, res, next) => {
  const client = await db.pool.connect();
  try {
    const value = validate(Joi.object({
      entry_reservation_date:    Joi.date().iso().greater('now').required(),
      departure_reservation_date:Joi.date().iso().greater(Joi.ref('entry_reservation_date')).required(),
      vehicle_code:              Joi.string().min(2).max(20).required(),
      id_vehicle_fk:             Joi.number().integer().required(),
      id_parking_fk:             Joi.number().integer().required(),
    }), req.body);

    // Verificar disponibilidad (no solapar con reservas activas)
    const overlap = await client.query(
      `SELECT id_reservation FROM reservations
       WHERE id_parking_fk=$1
         AND state NOT IN ('Cancelada','Finalizada')
         AND NOT (departure_reservation_date <= $2 OR entry_reservation_date >= $3)`,
      [value.id_parking_fk, value.entry_reservation_date, value.departure_reservation_date]
    );
    if (overlap.rows.length > 0) {
      return res.status(409).json({ error: 'El parqueadero no tiene disponibilidad en ese horario' });
    }

    // Calcular monto de reserva
    const pcResult = await client.query(
      'SELECT fee FROM parking_controllers WHERE id_parking_fk=$1 AND id_vehicle_fk=$2',
      [value.id_parking_fk, value.id_vehicle_fk]
    );
    const fee = parseFloat(pcResult.rows[0]?.fee ?? 0);
    const entryDate   = new Date(value.entry_reservation_date);
    const departDate  = new Date(value.departure_reservation_date);
    const hours       = (departDate - entryDate) / (1000 * 60 * 60);
    const reserveAmt  = fee * hours;

    await client.query('BEGIN');

    const resResult = await client.query(
      `INSERT INTO reservations
         (entry_reservation_date, departure_reservation_date, vehicle_code, state, id_vehicle_fk, id_user_fk, id_parking_fk)
       VALUES ($1,$2,$3,'Pendiente',$4,$5,$6) RETURNING id_reservation`,
      [value.entry_reservation_date, value.departure_reservation_date, value.vehicle_code,
       value.id_vehicle_fk, req.user.id_user, value.id_parking_fk]
    );
    const reservationId = resResult.rows[0].id_reservation;

    // Método de pago por defecto = tarjeta
    const pmResult = await client.query("SELECT id_payment_method FROM payment_methods WHERE name='Tarjeta'");
    const pmId = pmResult.rows[0]?.id_payment_method ?? 1;

    // Token de pago simulado (integrá aquí tu pasarela real)
    const paymentToken = uuidv4();

    await client.query(
      `INSERT INTO invoices
         (reserve_amount, service_amount, extra_time_amount, refund_amount, total_amount,
          time, payment_token, id_payment_method_fk, id_reservation_fk)
       VALUES ($1,0,0,0,$1,$2,$3,$4,$5)`,
      [reserveAmt.toFixed(2), hours.toFixed(2), paymentToken, pmId, reservationId]
    );

    await client.query('COMMIT');
    res.status(201).json({ message: 'Reserva creada exitosamente', id_reservation: reservationId });
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    next(err);
  } finally { client.release(); }
};

// ── PUT /cancel-reservation/:id ───────────────────────────────────────────────
exports.cancelReservation = async (req, res, next) => {
  try {
    const res_ = await db.query(
      `UPDATE reservations SET state='Cancelada'
       WHERE id_reservation=$1
         AND state='Pendiente'
         AND (id_user_fk=$2 OR $3 IN ('Administrador','SuperAdministrador'))
       RETURNING id_reservation`,
      [req.params.id, req.user.id_user, req.user.role]
    );
    if (!res_.rows.length) return res.status(404).json({ error: 'Reserva no encontrada o no cancelable' });
    res.json({ message: 'Reserva cancelada exitosamente' });
  } catch (err) { next(err); }
};

// ── PUT /check-in/:id ─────────────────────────────────────────────────────────
exports.checkIn = async (req, res, next) => {
  try {
    const result = await db.query(
      `UPDATE reservations SET state='En curso', check_in=NOW()
       WHERE id_reservation=$1 AND state='Pendiente'
       RETURNING id_reservation`,
      [req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Reserva no encontrada o ya procesada' });
    res.json({ message: 'Check-in realizado exitosamente' });
  } catch (err) { next(err); }
};

// ── PUT /check-out/:id ────────────────────────────────────────────────────────
exports.checkOut = async (req, res, next) => {
  const client = await db.pool.connect();
  try {
    const resResult = await client.query(
      `SELECT r.*, p.name AS parking_name, pc.fee,
              inv.id_invoice, inv.reserve_amount
       FROM reservations r
       LEFT JOIN parkings p ON p.id_parking = r.id_parking_fk
       LEFT JOIN parking_controllers pc ON pc.id_parking_fk=r.id_parking_fk AND pc.id_vehicle_fk=r.id_vehicle_fk
       LEFT JOIN invoices inv ON inv.id_reservation_fk = r.id_reservation
       WHERE r.id_reservation=$1 AND r.state='En curso'`,
      [req.params.id]
    );
    if (!resResult.rows.length) return res.status(404).json({ error: 'Reserva no encontrada o no en curso' });

    const reservation = resResult.rows[0];
    const checkOut    = new Date();
    const checkIn     = new Date(reservation.check_in);
    const depart      = new Date(reservation.departure_reservation_date);
    const fee         = parseFloat(reservation.fee ?? 0);

    const actualHours  = (checkOut - checkIn)  / (1000 * 60 * 60);
    const reserveHours = (depart   - new Date(reservation.entry_reservation_date)) / (1000 * 60 * 60);

    const extraHours   = Math.max(0, (checkOut - depart) / (1000 * 60 * 60));
    const unusedHours  = Math.max(0, (depart - checkOut) / (1000 * 60 * 60));

    const reserveAmt   = parseFloat(reservation.reserve_amount ?? 0);
    const extraAmt     = fee * extraHours;
    const refundAmt    = fee * unusedHours * 0.5; // reembolso del 50% por tiempo no utilizado
    const totalAmt     = reserveAmt + extraAmt - refundAmt;

    await client.query('BEGIN');
    await client.query(
      `UPDATE reservations SET state='Finalizada', check_out=$1 WHERE id_reservation=$2`,
      [checkOut, req.params.id]
    );
    await client.query(
      `UPDATE invoices SET extra_time_amount=$1, refund_amount=$2, total_amount=$3, time=$4
       WHERE id_reservation_fk=$5`,
      [extraAmt.toFixed(2), refundAmt.toFixed(2), totalAmt.toFixed(2), actualHours.toFixed(2), req.params.id]
    );
    await client.query('COMMIT');

    res.json({ message: 'Check-out realizado exitosamente', total_amount: totalAmt.toFixed(2) });
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    next(err);
  } finally { client.release(); }
};

// ── GET /invoice-mail/:id ─────────────────────────────────────────────────────
exports.sendInvoiceMail = async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT inv.*, r.vehicle_code, r.entry_reservation_date, r.departure_reservation_date,
              r.check_in, r.check_out, r.state,
              p.name AS parking_name, p.address AS parking_address,
              v.name AS vehicle_name,
              u.mail, u.first_name, u.last_name
       FROM invoices inv
       JOIN reservations r ON r.id_reservation = inv.id_reservation_fk
       JOIN parkings p ON p.id_parking = r.id_parking_fk
       JOIN vehicles v ON v.id_vehicle = r.id_vehicle_fk
       JOIN users u ON u.id_user = r.id_user_fk
       WHERE inv.id_invoice=$1`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Factura no encontrada' });

    const invoice = rows[0];
    await emailService.sendInvoice(invoice);

    res.send('Factura enviada exitosamente');
  } catch (err) { next(err); }
};
