const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const Joi     = require('joi');
const db      = require('../config/database');
const emailService = require('../services/email.service');

// ── Helpers ──────────────────────────────────────────────────────────────────

const validate = (schema, data) => {
  const { error, value } = schema.validate(data, { abortEarly: false });
  if (error) throw Object.assign(new Error(error.details.map(d => d.message).join(', ')), { status: 400 });
  return value;
};

const createRecord = (action, userId, ip, client = db) =>
  client.query(
    'INSERT INTO records (action, ip_user, id_user_fk) VALUES ($1,$2,$3)',
    [action, ip, userId]
  ).catch(() => {}); // audit log never blocks the response

// ── POST /login ───────────────────────────────────────────────────────────────
exports.login = async (req, res, next) => {
  try {
    const { user_name, password } = validate(Joi.object({
      user_name:       Joi.string().required().messages({ 'any.required': 'El usuario es requerido' }),
      password:        Joi.string().required().messages({ 'any.required': 'La contraseña es requerida' }),
      recaptchaToken:  Joi.string().optional(),
    }), req.body);

    const { rows } = await db.query(
      `SELECT u.*, r.name AS role_name,
              uc.is_account_blocked, uc.failed_attempts, uc.id_user_controller
       FROM users u
       LEFT JOIN roles r ON r.id_role = u.id_role_fk
       LEFT JOIN user_controllers uc ON uc.id_user_fk = u.id_user
       WHERE u.user_name = $1`,
      [user_name]
    );

    if (rows.length === 0) return res.status(401).json({ error: 'Credenciales inválidas' });
    const user = rows[0];

    if (!user.is_active)          return res.status(403).json({ error: 'Cuenta inactiva' });
    if (user.is_account_blocked)  return res.status(403).json({ error: 'Cuenta bloqueada. Contacta al administrador.' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      const attempts = (user.failed_attempts || 0) + 1;
      const blocked  = attempts >= 5;
      await db.query(
        'UPDATE user_controllers SET failed_attempts=$1, is_account_blocked=$2 WHERE id_user_fk=$3',
        [attempts, blocked, user.id_user]
      );
      if (blocked) return res.status(403).json({ error: 'Cuenta bloqueada por múltiples intentos fallidos. Contacta al administrador.' });
      return res.status(401).json({ error: `Credenciales inválidas. Intentos: ${attempts}/5` });
    }

    // Resetear intentos fallidos
    await db.query(
      'UPDATE user_controllers SET failed_attempts=0 WHERE id_user_fk=$1',
      [user.id_user]
    );

    await createRecord('Inicio de sesión', user.id_user, req.ip);

    const token = jwt.sign(
      { id_user: user.id_user, user_name: user.user_name, role: user.role_name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.json({ token });
  } catch (err) { next(err); }
};

// ── POST /register ───────────────────────────────────────────────────────────
exports.register = async (req, res, next) => {
  const client = await db.pool.connect();
  try {
    const value = validate(Joi.object({
      mail:                Joi.string().email().required(),
      user_name:           Joi.string().alphanum().min(3).max(50).required(),
      first_name:          Joi.string().min(2).max(100).required(),
      last_name:           Joi.string().min(2).max(100).required(),
      password:            Joi.string().min(8).max(100).required(),
      identification_card: Joi.string().min(5).max(20).required(),
      number:              Joi.string().min(13).max(19).required(),
      expiration_date:     Joi.string().pattern(/^\d{2}\/\d{2}$/).required(),
      cvc:                 Joi.string().min(3).max(4).required(),
    }), req.body);

    await client.query('BEGIN');

    const dup = await client.query(
      'SELECT id_user FROM users WHERE user_name=$1 OR mail=$2',
      [value.user_name, value.mail]
    );
    if (dup.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'El nombre de usuario o correo ya está registrado' });
    }

    const dupCard = await client.query(
      'SELECT id_user FROM users WHERE identification_card=$1',
      [value.identification_card]
    );
    if (dupCard.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'La cédula ya está registrada' });
    }

    const roleRes = await client.query("SELECT id_role FROM roles WHERE name='Usuario'");
    const hashed  = await bcrypt.hash(value.password, 12);

    const userRes = await client.query(
      `INSERT INTO users (first_name,last_name,user_name,mail,password,identification_card,is_active,mail_verified,id_role_fk)
       VALUES ($1,$2,$3,$4,$5,$6,true,false,$7) RETURNING id_user`,
      [value.first_name, value.last_name, value.user_name, value.mail,
       hashed, value.identification_card, roleRes.rows[0].id_role]
    );
    const userId = userRes.rows[0].id_user;

    await client.query(
      'INSERT INTO user_controllers (is_account_blocked, failed_attempts, id_user_fk) VALUES (false,0,$1)',
      [userId]
    );
    await client.query(
      'INSERT INTO cards (number,cvc,expiration_date,id_user_fk) VALUES ($1,$2,$3,$4)',
      [value.number, value.cvc, value.expiration_date, userId]
    );

    await client.query('COMMIT');
    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    next(err);
  } finally {
    client.release();
  }
};

// ── POST /request-token ──────────────────────────────────────────────────────
exports.requestToken = async (req, res, next) => {
  try {
    const { mail, type, url } = validate(Joi.object({
      mail: Joi.string().email().required(),
      type: Joi.string().valid('Recovery', 'Welcome').required(),
      url:  Joi.string().required(),
    }), req.body);

    const { rows } = await db.query('SELECT * FROM users WHERE mail=$1', [mail]);
    // No revelar si el correo existe
    if (rows.length === 0) return res.json({ message: 'Si el correo está registrado, recibirás un enlace en breve' });

    const user = rows[0];

    // Invalidar tokens anteriores del mismo tipo
    await db.query(
      "UPDATE tokens SET is_used=true WHERE id_user_fk=$1 AND type=$2 AND is_used=false",
      [user.id_user, type]
    );

    const tokenValue = uuidv4();
    const expiresAt  = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    await db.query(
      'INSERT INTO tokens (token,type,expiration_date,is_used,id_user_fk) VALUES ($1,$2,$3,false,$4)',
      [tokenValue, type, expiresAt, user.id_user]
    );

    const link = url + tokenValue;
    if (type === 'Recovery') {
      await emailService.sendPasswordRecovery(user.mail, user.first_name, link);
    } else {
      await emailService.sendWelcomeVerification(user.mail, user.first_name, link);
    }

    res.json({ message: 'Correo enviado exitosamente' });
  } catch (err) { next(err); }
};

// ── POST /recover-password/:token ────────────────────────────────────────────
exports.recoverPassword = async (req, res, next) => {
  try {
    const { password } = validate(Joi.object({
      password: Joi.string().min(8).max(100).required(),
    }), req.body);

    const { rows } = await db.query(
      "SELECT * FROM tokens WHERE token=$1 AND type='Recovery' AND is_used=false AND expiration_date>NOW()",
      [req.params.token]
    );
    if (rows.length === 0) return res.status(400).json({ error: 'Token inválido o expirado' });

    const hashed = await bcrypt.hash(password, 12);
    await db.query('UPDATE users SET password=$1 WHERE id_user=$2', [hashed, rows[0].id_user_fk]);
    await db.query('UPDATE tokens SET is_used=true WHERE id_token=$1', [rows[0].id_token]);

    res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (err) { next(err); }
};

// ── POST /verify-email/:token ────────────────────────────────────────────────
exports.verifyEmail = async (req, res, next) => {
  try {
    const { rows } = await db.query(
      "SELECT * FROM tokens WHERE token=$1 AND type='Welcome' AND is_used=false AND expiration_date>NOW()",
      [req.params.token]
    );
    if (rows.length === 0) return res.status(400).json({ error: 'Token inválido o expirado' });

    await db.query('UPDATE users SET mail_verified=true WHERE id_user=$1', [rows[0].id_user_fk]);
    await db.query('UPDATE tokens SET is_used=true WHERE id_token=$1', [rows[0].id_token]);

    res.json({ message: 'Correo verificado exitosamente' });
  } catch (err) { next(err); }
};
