const express = require("express");
const router = express.Router();
const controller = require('../controller/managerDetails_controller.js');
const upload = require("../middleware/multer.js")
const {verify_admin,verify_manager} = require('../middleware/Authentication.js')

router.post('/profileDetails',verify_manager,upload.any(),controller.manager_profile);
router.get('/getrecording',verify_manager,controller.getrecording)
module.exports = router;