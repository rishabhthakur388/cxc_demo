const express = require("express");
const router = express.Router();
const controller = require('../controller/users_controller');
const upload = require("../middleware/multer.js");
const {verify_admin,verify_manager} = require('../middleware/Authentication')

router.post('/signup',controller.signUp);
router.post('/forgotPassword',controller.forgot_password);
router.post('/verification',controller.verification);
router.post('/resetpassword',controller.reset_password);
router.get('/gettokenAdmin',verify_admin,controller.get_token_admin);
router.get('/gettokenManager',verify_manager,controller.get_token_manager);
router.post('/login',controller.login);
router.post('/adminAccountSetup',verify_admin,controller.account_setup);
router.post('/add_adminProfile',verify_admin,upload.any(),controller.add_adminProfile);
router.post('/managerAccountSetup',verify_manager,controller.account_setup);




module.exports = router;