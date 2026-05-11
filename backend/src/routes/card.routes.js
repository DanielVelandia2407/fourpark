const router = require('express').Router();
const { authenticate } = require('../middlewares/auth.middleware');
const ctrl = require('../controllers/card.controller');

router.get('/card', authenticate, ctrl.getCard);
router.put('/card', authenticate, ctrl.updateCard);

module.exports = router;
