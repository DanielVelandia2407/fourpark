const router = require('express').Router();
const ctrl   = require('../controllers/auth.controller');

router.post('/login',                ctrl.login);
router.post('/register',             ctrl.register);
router.post('/request-token',        ctrl.requestToken);
router.post('/recover-password/:token', ctrl.recoverPassword);
router.post('/verify-email/:token',  ctrl.verifyEmail);

module.exports = router;
