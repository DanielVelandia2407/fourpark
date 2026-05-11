const bcrypt = require('bcryptjs');
const Joi    = require('joi');
const db     = require('../config/database');

const validate = (schema, data) => {
  const { error, value } = schema.validate(data, { abortEarly: false });
  if (error) throw Object.assign(new Error(error.details.map(d => d.message).join(', ')), { status: 400 });
  return value;
};

const USER_SELECT = `
  SELECT u.id_user, u.first_name, u.last_name, u.user_name, u.mail,
         u.identification_card, u.is_active, u.mail_verified, u.id_role_fk,
         r.name AS role_name,
         uc.is_account_blocked
  FROM users u
  LEFT JOIN roles r ON r.id_role = u.id_role_fk
  LEFT JOIN user_controllers uc ON uc.id_user_fk = u.id_user
`;

// ── GET /user ────────────────────────────────────────────────────────────────
exports.getMe = async (req, res, next) => {
  try {
    const { rows } = await db.query(USER_SELECT + ' WHERE u.id_user=$1', [req.user.id_user]);
    if (!rows.length) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(rows[0]);
  } catch (err) { next(err); }
};

// ── PUT /update-user ─────────────────────────────────────────────────────────
exports.updateMe = async (req, res, next) => {
  try {
    const { user_name, first_name, last_name, identification_card } = validate(Joi.object({
      user_name:           Joi.string().alphanum().min(3).max(50).required(),
      first_name:          Joi.string().min(2).max(100).required(),
      last_name:           Joi.string().min(2).max(100).required(),
      identification_card: Joi.string().min(5).max(20).required(),
    }), req.body);

    // Verificar unicidad de user_name (excluyendo el propio usuario)
    const dup = await db.query(
      'SELECT id_user FROM users WHERE user_name=$1 AND id_user<>$2',
      [user_name, req.user.id_user]
    );
    if (dup.rows.length) return res.status(409).json({ error: 'El nombre de usuario ya está en uso' });

    await db.query(
      'UPDATE users SET user_name=$1, first_name=$2, last_name=$3, identification_card=$4 WHERE id_user=$5',
      [user_name, first_name, last_name, identification_card, req.user.id_user]
    );
    res.json({ message: 'Perfil actualizado exitosamente' });
  } catch (err) { next(err); }
};

// ── PUT /update-password ─────────────────────────────────────────────────────
exports.updatePassword = async (req, res, next) => {
  try {
    const { password } = validate(Joi.object({
      password: Joi.string().min(8).max(100).required(),
    }), req.body);

    const hashed = await bcrypt.hash(password, 12);
    await db.query('UPDATE users SET password=$1 WHERE id_user=$2', [hashed, req.user.id_user]);
    res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (err) { next(err); }
};

// ── GET /users ───────────────────────────────────────────────────────────────
exports.getAllUsers = async (req, res, next) => {
  try {
    const { rows } = await db.query(USER_SELECT + ' ORDER BY u.id_user');
    res.json(rows);
  } catch (err) { next(err); }
};

// ── GET /users/:id ───────────────────────────────────────────────────────────
exports.getUserById = async (req, res, next) => {
  try {
    const { rows } = await db.query(USER_SELECT + ' WHERE u.id_user=$1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(rows[0]);
  } catch (err) { next(err); }
};

// ── PUT /update-user/:id ─────────────────────────────────────────────────────
exports.updateUserById = async (req, res, next) => {
  try {
    const value = validate(Joi.object({
      user_name:           Joi.string().alphanum().min(3).max(50),
      first_name:          Joi.string().min(2).max(100),
      last_name:           Joi.string().min(2).max(100),
      identification_card: Joi.string().min(5).max(20),
      is_active:           Joi.boolean(),
      id_role_fk:          Joi.number().integer(),
    }).min(1), req.body);

    // Construir SET dinámico
    const fields = [];
    const vals   = [];
    let idx = 1;
    for (const [k, v] of Object.entries(value)) {
      fields.push(`${k}=$${idx++}`);
      vals.push(v);
    }
    vals.push(req.params.id);

    await db.query(
      `UPDATE users SET ${fields.join(',')} WHERE id_user=$${idx}`,
      vals
    );
    res.json({ message: 'Usuario actualizado exitosamente' });
  } catch (err) { next(err); }
};

// ── PUT /unlock-user/:id ─────────────────────────────────────────────────────
exports.unlockUser = async (req, res, next) => {
  try {
    const result = await db.query(
      'UPDATE user_controllers SET is_account_blocked=false, failed_attempts=0 WHERE id_user_fk=$1',
      [req.params.id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ message: 'Cuenta desbloqueada exitosamente' });
  } catch (err) { next(err); }
};
