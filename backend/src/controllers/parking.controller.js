const Joi  = require('joi');
const path = require('path');
const fs   = require('fs');
const db   = require('../config/database');
const geocodingService = require('../services/geocoding.service');

const validate = (schema, data) => {
  const { error, value } = schema.validate(data, { abortEarly: false });
  if (error) throw Object.assign(new Error(error.details.map(d => d.message).join(', ')), { status: 400 });
  return value;
};

const PARKING_SELECT = `
  SELECT p.*,
         c.id_city, c.name AS city_name,
         tp.id_type_parking, tp.name AS type_parking_name,
         s.id_schedule, s.name AS schedule_name, s.initial_day, s.final_day, s.opening_time, s.closing_time,
         u.user_name, u.first_name, u.last_name,
         json_agg(
           json_build_object(
             'id_parking_controller', pc.id_parking_controller,
             'capacity', pc.capacity,
             'fee', pc.fee,
             'id_vehicle_fk', pc.id_vehicle_fk,
             'id_parking_fk', pc.id_parking_fk,
             'vehicles', json_build_object('id_vehicle', v.id_vehicle, 'name', v.name)
           ) ORDER BY v.id_vehicle
         ) AS parking_controllers
  FROM parkings p
  LEFT JOIN cities c ON c.id_city = p.id_city_fk
  LEFT JOIN types_parking tp ON tp.id_type_parking = p.id_type_parking_fk
  LEFT JOIN schedules s ON s.id_schedule = p.id_schedule_fk
  LEFT JOIN users u ON u.id_user = p.id_user_fk
  LEFT JOIN parking_controllers pc ON pc.id_parking_fk = p.id_parking
  LEFT JOIN vehicles v ON v.id_vehicle = pc.id_vehicle_fk
`;

const formatParking = (row) => ({
  id_parking:          row.id_parking,
  name:                row.name,
  description:         row.description,
  address:             row.address,
  longitude:           parseFloat(row.longitude),
  latitude:            parseFloat(row.latitude),
  image_path:          row.image_path,
  has_loyalty_service: row.has_loyalty_service,
  is_active:           row.is_active,
  id_city_fk:          row.id_city_fk,
  id_type_parking_fk:  row.id_type_parking_fk,
  id_schedule_fk:      row.id_schedule_fk,
  id_user_fk:          row.id_user_fk,
  cities:              { id_city: row.id_city, name: row.city_name },
  types_parking:       { id_type_parking: row.id_type_parking, name: row.type_parking_name },
  schedules: {
    id_schedule: row.id_schedule, name: row.schedule_name,
    initial_day: row.initial_day, final_day: row.final_day,
    opening_time: row.opening_time, closing_time: row.closing_time,
  },
  users: row.user_name ? { user_name: row.user_name, first_name: row.first_name, last_name: row.last_name } : null,
  parking_controllers: (row.parking_controllers || []).filter(pc => pc.id_parking_controller !== null),
  car_capacity:        row.parking_controllers?.find(pc => pc.vehicles?.name === 'Carro')?.capacity ?? 0,
  car_fee:             row.parking_controllers?.find(pc => pc.vehicles?.name === 'Carro')?.fee ?? 0,
});

// ── GET /parkings ─────────────────────────────────────────────────────────────
exports.getAllParkings = async (req, res, next) => {
  try {
    const { rows } = await db.query(
      PARKING_SELECT + ' GROUP BY p.id_parking,c.id_city,tp.id_type_parking,s.id_schedule,u.id_user ORDER BY p.id_parking'
    );
    res.json(rows.map(formatParking));
  } catch (err) { next(err); }
};

// ── GET /parkings/:id ─────────────────────────────────────────────────────────
exports.getParkingById = async (req, res, next) => {
  try {
    const { rows } = await db.query(
      PARKING_SELECT + ' WHERE p.id_parking=$1 GROUP BY p.id_parking,c.id_city,tp.id_type_parking,s.id_schedule,u.id_user',
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Parqueadero no encontrado' });
    res.json(formatParking(rows[0]));
  } catch (err) { next(err); }
};

// ── Helpers para parking_controllers ─────────────────────────────────────────
const upsertControllers = async (client, parkingId, body) => {
  const vehicleRows = await client.query('SELECT id_vehicle, name FROM vehicles');
  const vehicles = vehicleRows.rows;

  const mapping = {
    Carro:     { cap: 'car_capacity',       fee: 'car_fee' },
    Moto:      { cap: 'motorbike_capacity',  fee: 'motorbike_fee' },
    Bicicleta: { cap: 'bicycle_capacity',    fee: 'bicycle_fee' },
  };

  for (const v of vehicles) {
    const m = mapping[v.name];
    if (!m) continue;
    const cap = parseInt(body[m.cap] ?? 0);
    const fee = parseFloat(body[m.fee] ?? 0);
    await client.query(
      `INSERT INTO parking_controllers (capacity, fee, id_vehicle_fk, id_parking_fk)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (id_vehicle_fk, id_parking_fk)
       DO UPDATE SET capacity=EXCLUDED.capacity, fee=EXCLUDED.fee`,
      [cap, fee, v.id_vehicle, parkingId]
    );
  }
};

const parkingSchema = Joi.object({
  name:               Joi.string().min(3).max(150).required(),
  description:        Joi.string().max(500).allow('', null),
  address:            Joi.string().min(5).max(255).required(),
  longitude:          Joi.number().required(),
  latitude:           Joi.number().required(),
  has_loyalty_service:Joi.alternatives().try(Joi.boolean(), Joi.string()).optional(),
  is_active:          Joi.alternatives().try(Joi.boolean(), Joi.string()).optional(),
  id_type_parking_fk: Joi.number().integer().required(),
  id_user_fk:         Joi.number().integer().allow(null, ''),
  id_schedule_fk:     Joi.number().integer().required(),
  id_city_fk:         Joi.number().integer().required(),
  car_capacity:       Joi.number().integer().min(0).default(0),
  car_fee:            Joi.number().min(0).default(0),
  motorbike_capacity: Joi.number().integer().min(0).default(0),
  motorbike_fee:      Joi.number().min(0).default(0),
  bicycle_capacity:   Joi.number().integer().min(0).default(0),
  bicycle_fee:        Joi.number().min(0).default(0),
});

// ── POST /parkings ────────────────────────────────────────────────────────────
exports.createParking = async (req, res, next) => {
  const client = await db.pool.connect();
  try {
    const value = validate(parkingSchema, req.body);
    const imagePath = req.file ? `/uploads/parkings/${req.file.filename}` : null;

    await client.query('BEGIN');
    const result = await client.query(
      `INSERT INTO parkings
         (name,description,address,longitude,latitude,image_path,has_loyalty_service,is_active,
          id_city_fk,id_type_parking_fk,id_schedule_fk,id_user_fk)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING id_parking`,
      [value.name, value.description, value.address, value.longitude, value.latitude,
       imagePath,
       value.has_loyalty_service === 'true' || value.has_loyalty_service === true,
       value.is_active !== 'false' && value.is_active !== false,
       value.id_city_fk, value.id_type_parking_fk, value.id_schedule_fk,
       value.id_user_fk || null]
    );
    await upsertControllers(client, result.rows[0].id_parking, value);
    await client.query('COMMIT');

    res.status(201).json({ message: 'Parqueadero creado exitosamente', id_parking: result.rows[0].id_parking });
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    if (req.file) fs.unlink(req.file.path, () => {});
    next(err);
  } finally { client.release(); }
};

// ── PUT /parkings-with-image/:id ──────────────────────────────────────────────
exports.updateParkingWithImage = async (req, res, next) => {
  const client = await db.pool.connect();
  try {
    if (!req.file) return res.status(400).json({ error: 'Se requiere una imagen' });
    const value = validate(parkingSchema, req.body);

    // Eliminar imagen anterior
    const old = await client.query('SELECT image_path FROM parkings WHERE id_parking=$1', [req.params.id]);
    if (old.rows[0]?.image_path) {
      const oldPath = path.join(__dirname, '../../', old.rows[0].image_path);
      fs.unlink(oldPath, () => {});
    }

    const imagePath = `/uploads/parkings/${req.file.filename}`;
    await client.query('BEGIN');
    await client.query(
      `UPDATE parkings SET name=$1,description=$2,address=$3,longitude=$4,latitude=$5,image_path=$6,
       has_loyalty_service=$7,is_active=$8,id_city_fk=$9,id_type_parking_fk=$10,id_schedule_fk=$11,id_user_fk=$12
       WHERE id_parking=$13`,
      [value.name, value.description, value.address, value.longitude, value.latitude, imagePath,
       value.has_loyalty_service === 'true' || value.has_loyalty_service === true,
       value.is_active !== 'false' && value.is_active !== false,
       value.id_city_fk, value.id_type_parking_fk, value.id_schedule_fk,
       value.id_user_fk || null, req.params.id]
    );
    await upsertControllers(client, req.params.id, value);
    await client.query('COMMIT');

    res.json({ message: 'Parqueadero actualizado exitosamente' });
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    if (req.file) fs.unlink(req.file.path, () => {});
    next(err);
  } finally { client.release(); }
};

// ── PUT /parkings-without-image/:id ──────────────────────────────────────────
exports.updateParkingWithoutImage = async (req, res, next) => {
  const client = await db.pool.connect();
  try {
    const value = validate(parkingSchema, req.body);
    await client.query('BEGIN');
    await client.query(
      `UPDATE parkings SET name=$1,description=$2,address=$3,longitude=$4,latitude=$5,
       has_loyalty_service=$6,is_active=$7,id_city_fk=$8,id_type_parking_fk=$9,id_schedule_fk=$10,id_user_fk=$11
       WHERE id_parking=$12`,
      [value.name, value.description, value.address, value.longitude, value.latitude,
       value.has_loyalty_service === 'true' || value.has_loyalty_service === true,
       value.is_active !== 'false' && value.is_active !== false,
       value.id_city_fk, value.id_type_parking_fk, value.id_schedule_fk,
       value.id_user_fk || null, req.params.id]
    );
    await upsertControllers(client, req.params.id, value);
    await client.query('COMMIT');

    res.json({ message: 'Parqueadero actualizado exitosamente' });
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    next(err);
  } finally { client.release(); }
};

// ── DELETE /parkings/:id ──────────────────────────────────────────────────────
exports.deleteParking = async (req, res, next) => {
  try {
    const old = await db.query('SELECT image_path FROM parkings WHERE id_parking=$1', [req.params.id]);
    if (!old.rows.length) return res.status(404).json({ error: 'Parqueadero no encontrado' });

    await db.query('DELETE FROM parkings WHERE id_parking=$1', [req.params.id]);

    if (old.rows[0]?.image_path) {
      const imgPath = path.join(__dirname, '../../', old.rows[0].image_path);
      fs.unlink(imgPath, () => {});
    }
    res.json({ message: 'Parqueadero eliminado exitosamente' });
  } catch (err) { next(err); }
};

// ── GET /address?lat=&lon= ────────────────────────────────────────────────────
exports.getAddress = async (req, res, next) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) return res.status(400).json({ error: 'Se requieren lat y lon' });
    const address = await geocodingService.reverseGeocode(parseFloat(lat), parseFloat(lon));
    res.json({ address });
  } catch (err) { next(err); }
};
