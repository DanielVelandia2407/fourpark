const Joi = require('joi');
const db  = require('../config/database');

const validate = (schema, data) => {
  const { error, value } = schema.validate(data, { abortEarly: false });
  if (error) throw Object.assign(new Error(error.details.map(d => d.message).join(', ')), { status: 400 });
  return value;
};

// ── GET /card ─────────────────────────────────────────────────────────────────
exports.getCard = async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT c.id_card, c.number, c.cvc, c.expiration_date, c.id_user_fk,
              u.id_user, u.first_name, u.last_name, u.user_name, u.mail
       FROM cards c
       JOIN users u ON u.id_user = c.id_user_fk
       WHERE c.id_user_fk=$1`,
      [req.user.id_user]
    );
    if (!rows.length) return res.status(404).json({ error: 'Tarjeta no encontrada' });
    res.json(rows[0]);
  } catch (err) { next(err); }
};

// ── PUT /card ─────────────────────────────────────────────────────────────────
exports.updateCard = async (req, res, next) => {
  try {
    const { number, cvc, expiration_date } = validate(Joi.object({
      number:          Joi.string().min(13).max(19).required(),
      cvc:             Joi.string().min(3).max(4).required(),
      expiration_date: Joi.string().pattern(/^\d{2}\/\d{2}$/).required()
        .messages({ 'string.pattern.base': 'La fecha de expiración debe tener el formato MM/YY' }),
    }), req.body);

    const result = await db.query(
      'UPDATE cards SET number=$1, cvc=$2, expiration_date=$3 WHERE id_user_fk=$4 RETURNING id_card',
      [number, cvc, expiration_date, req.user.id_user]
    );

    if (!result.rows.length) {
      // Si no existe, crear una
      await db.query(
        'INSERT INTO cards (number,cvc,expiration_date,id_user_fk) VALUES ($1,$2,$3,$4)',
        [number, cvc, expiration_date, req.user.id_user]
      );
    }

    res.json({ message: 'Tarjeta actualizada exitosamente' });
  } catch (err) { next(err); }
};
