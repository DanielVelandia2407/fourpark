const jwt = require('jsonwebtoken');

/**
 * Verifica el JWT del header Authorization: Bearer <token>
 * Agrega req.user = { id_user, user_name, role }
 */
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }
  const token = authHeader.split(' ')[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

/**
 * Restringe el acceso a uno o más roles.
 * Uso: authorizeRole('SuperAdministrador', 'Administrador')
 */
const authorizeRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  next();
};

module.exports = { authenticate, authorizeRole };
