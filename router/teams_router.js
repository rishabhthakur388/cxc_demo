const express = require("express");
const router = express.Router();
const controller = require('../controller/team_controller');
const {verify_admin,verify_manager} = require('../middleware/Authentication')

router.get('/teams',verify_admin,controller.teams);
router.post('/assignManager',verify_admin,controller.assignCxcManager);
router.post('/editTeam',verify_admin,controller.editManagerProfile);
router.patch('/bulkUpdate',verify_admin,controller.bulkUpdate );
router.delete('/deletemanager',verify_admin,controller.deleteManager);
router.get('/filter',verify_admin,controller.filter );

module.exports = router;    