const express = require("express");
const router = express.Router();
const controller = require('../controller/payment_controller');
const {verify_admin,verify_manager} = require('../middleware/Authentication')

router.post('/adminPaymentDetails',verify_manager,controller.payment_details);

module.exports = router;