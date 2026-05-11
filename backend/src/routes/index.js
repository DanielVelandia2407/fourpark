const router = require('express').Router();

router.use(require('./auth.routes'));
router.use(require('./user.routes'));
router.use(require('./parking.routes'));
router.use(require('./reservation.routes'));
router.use(require('./card.routes'));
router.use(require('./admin.routes'));

module.exports = router;
