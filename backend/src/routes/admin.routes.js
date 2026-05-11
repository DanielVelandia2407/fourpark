const router = require('express').Router();
const { authenticate, authorizeRole } = require('../middlewares/auth.middleware');
const ctrl = require('../controllers/admin.controller');

const superAdmin  = ['SuperAdministrador'];
const adminRoles  = ['SuperAdministrador', 'Administrador'];

// Catálogos
router.get ('/types-parking',            ctrl.getTypesParkings);
router.get ('/cities',                   ctrl.getCities);
router.get ('/schedules',                ctrl.getSchedules);

// Registro de administrador
router.post('/register-administrator',
  authenticate, authorizeRole(...superAdmin),
  ctrl.registerAdministrator
);

// Registros de auditoría
router.get ('/records',
  authenticate, authorizeRole(...superAdmin),
  ctrl.getRecords
);

// Estadísticas
router.post('/statistics-admin',
  authenticate, authorizeRole(...adminRoles),
  ctrl.statisticsAdmin
);

router.post('/statistics-pdf',
  authenticate, authorizeRole(...superAdmin),
  ctrl.statisticsPdf
);

router.post('/statistics-excel',
  authenticate, authorizeRole(...superAdmin),
  ctrl.statisticsExcel
);

module.exports = router;
