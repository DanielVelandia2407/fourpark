const router = require('express').Router();
const { authenticate, authorizeRole } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');
const ctrl   = require('../controllers/parking.controller');

const adminRoles = ['SuperAdministrador', 'Administrador'];

// Público
router.get('/parkings',     ctrl.getAllParkings);
router.get('/parkings/:id', ctrl.getParkingById);

// Solo admins
router.post('/parkings',
  authenticate, authorizeRole(...adminRoles),
  upload.single('image_path'),
  ctrl.createParking
);

router.put('/parkings-with-image/:id',
  authenticate, authorizeRole(...adminRoles),
  upload.single('image_path'),
  ctrl.updateParkingWithImage
);

router.put('/parkings-without-image/:id',
  authenticate, authorizeRole(...adminRoles),
  ctrl.updateParkingWithoutImage
);

router.delete('/parkings/:id',
  authenticate, authorizeRole('SuperAdministrador'),
  ctrl.deleteParking
);

// Geocoding inverso (convierte coordenadas en dirección)
router.get('/address', authenticate, ctrl.getAddress);

module.exports = router;
