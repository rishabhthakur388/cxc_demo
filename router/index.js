const express = require('express')
const router = express.Router();

router.use('/', require('./signUp_router'));
router.use('/', require('./payment_router'));
router.use('/', require('./teams_router'));
router.use('/', require('./mangerDetails_router.js'));

module.exports = router;