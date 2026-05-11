const router = require('express').Router();
const { authenticate, authorizeRole } = require('../middlewares/auth.middleware');
const ctrl = require('../controllers/reservation.controller');

router.get ('/reservations',              authenticate, ctrl.getReservations);
router.post('/reservations',              authenticate, ctrl.createReservation);
router.put ('/cancel-reservation/:id',    authenticate, ctrl.cancelReservation);
router.put ('/check-in/:id',              authenticate, authorizeRole('SuperAdministrador', 'Administrador'), ctrl.checkIn);
router.put ('/check-out/:id',             authenticate, authorizeRole('SuperAdministrador', 'Administrador'), ctrl.checkOut);

// Factura por correo
router.get ('/invoice-mail/:id',          authenticate, ctrl.sendInvoiceMail);

module.exports = router;
