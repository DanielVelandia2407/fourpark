const router = require('express').Router();
const { authenticate, authorizeRole } = require('../middlewares/auth.middleware');
const ctrl = require('../controllers/parking.controller');

const adminRoles = ['SuperAdministrador', 'Administrador'];

// Público
router.get('/parkings',     ctrl.getAllParkings);
router.get('/parkings/:id', ctrl.getParkingById);

// Solo admins
router.post('/parkings',
  authenticate, authorizeRole(...adminRoles),
  ctrl.createParking
);

router.put('/parkings/:id',
  authenticate, authorizeRole(...adminRoles),
  ctrl.updateParking
);

router.delete('/parkings/:id',
  authenticate, authorizeRole('SuperAdministrador'),
  ctrl.deleteParking
);

// Geocoding inverso
router.get('/address', authenticate, ctrl.getAddress);

module.exports = router;
