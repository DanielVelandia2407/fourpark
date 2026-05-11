const router = require('express').Router();
const { authenticate, authorizeRole } = require('../middlewares/auth.middleware');
const ctrl = require('../controllers/user.controller');

// Perfil del usuario autenticado
router.get ('/user',            authenticate, ctrl.getMe);
router.put ('/update-user',     authenticate, ctrl.updateMe);
router.put ('/update-password', authenticate, ctrl.updatePassword);

// Gestión de usuarios (solo admins)
const adminRoles = ['SuperAdministrador', 'Administrador'];
router.get ('/users',            authenticate, authorizeRole(...adminRoles), ctrl.getAllUsers);
router.get ('/users/:id',        authenticate, authorizeRole(...adminRoles), ctrl.getUserById);
router.put ('/update-user/:id',  authenticate, authorizeRole(...adminRoles), ctrl.updateUserById);
router.put ('/unlock-user/:id',  authenticate, authorizeRole(...adminRoles), ctrl.unlockUser);

module.exports = router;
