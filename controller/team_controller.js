const { Op } = require("sequelize");
const resp = require("../helper/response");
const db = require("../models/index");
const ADMIN = db.admin_user;
const MANAGER_DETAILS = db.manager_details;
const MANAGER = db.manager_user;
const { body, validationResult } = require('express-validator');


//////////////////// TEAM DASHBOARD //////////////////////////////////////////////

exports.teams = async (req, res) => {
    try {
        const findUser = await MANAGER.findAll({
            attributes: [
                'name',
                'email',
                'recording',
                'trade',
                'cxc_manager_id',
            ],
            include: [{
                model: MANAGER_DETAILS,
                attributes: ['id', 'profile_picture', 'phone_number']
            },
            {
                model: ADMIN,
                attributes: ['id', 'profile_picture', 'name']
            }]

        });
        if (findUser.length == 0) {
            return resp.failedResponseWithMsg(res, "NO_TEAMS_FOUND");
        }
        return resp.successResponse(res, "SUCCESSFULLY_FOUNDED", findUser);
    } catch (error) {
        return resp.failedResponse(res, error.message);
    }
}

//////////////////////////////// ASSIGN MANAGER /////////////////////////////////////

exports.assignCxcManager = [
    body('email').notEmpty().isEmail().withMessage("enter_a_valid_email"),
    async (req, res) => {
        const reqBody = req.body;
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return resp.failedResponseWithMsg(res, errors.array())
            };
            const findUser = await MANAGER.findAll({
                where: {
                    email: reqBody.email
                }
            });
            if (findUser.length == 0) {
                return resp.failedResponseWithMsg(res, "USER_NOT_FOUND");
            }
            const data = await MANAGER.update({
                cxc_manager_id: reqBody.cxc_manager_id
            }, {
                where: {
                    email: reqBody.email
                }
            });
            return resp.successResponse(res, "SUCCESSFULLY_ADDED", data);
        } catch (error) {
            return resp.failedResponse(res, error.message);
        };
    }];

///////////////////////////////////// edit Manager //////////////////////////////////////// 

exports.editManagerProfile =
    async (req, res) => {
        const reqBody = req.body;
        try {

            const findUser = await MANAGER.findOne({
                where: {
                    id: reqBody.id
                }
            });
            if (!findUser) {
                return resp.failedResponseWithMsg(res, "USER_NOT_FOUND")
            };
            await MANAGER.update({
                name: reqBody.name,
                email: reqBody.email,
                phone_number: reqBody.phone_number,
                cxc_manager_id: reqBody.cxc_manager_id,
                trade: reqBody.trade,
                recording: reqBody.recording
            }, {
                where: {
                    id: reqBody.id
                }
            });
            return resp.successResponse(res, "SUCCESSFULLY_UPDATED");
        } catch (error) {
            return resp.failedResponse(res, error.message);
        }
    };


///////////////////////////////// BULK UPDATE ////////////////////////////////// 

exports.bulkUpdate = async (req, res) => {
    const reqBody = req.body;
    try {
        const findUser = await MANAGER.findAll({
            where: {
                id: {
                    [Op.in]: req.body.ids.split(",")
                }
            }
        });
        if (findUser.length == 0) {
            return resp.failedResponseWithMsg(res, "USER_NOT_FOUND")
        };
        await MANAGER.update({
            cxc_manager_id: reqBody.cxc_manager_id,
            trade: reqBody.trade,
            recording: reqBody.recording,
            sms: reqBody.sms
        }, {
            where: {
                id: {
                    [Op.in]: req.body.ids.split(",")
                }
            }
        });
        return resp.successResponse(res, "SUCCESSFULLY_UPDATED");
    } catch (error) {
        return resp.failedResponse(res, error.message)
    }
}

//////////////////////// delete member ////////////////////////////////

exports.deleteManager = async (req, res) => {
    try {
        const reqBody = req.body;
        const findUser = await MANAGER.findOne({
            where: {
                id: reqBody.id
            }
        });
        if (!findUser) {
            return resp.failedResponseWithMsg(res, "USER_NOT_FOUND");
        }
        const payload = await MANAGER.destroy({
            where: { id: reqBody.id }
        });
        return resp.successResponse(res, "USER_DELETED_SUCCESFULLY", payload);
    } catch (error) {
        return resp.failedResponse(res, error.message);
    }
};

//////////////////////////////FILTER//////////////////////////////////

exports.filter = async (req, res) => {
    const reqQuery = req.query;
    try {
        const whereClause = {};
        if (reqQuery.trade) whereClause.trade = { [Op.like]: `%${reqQuery.trade}%` }
        if (reqQuery.manager_id) whereClause.manager_id = reqQuery.manager_id;
        if (reqQuery.cxc_manager_id) whereClause.cxc_manager_id = reqQuery.cxc_manager_id;
        if (reqQuery.recording) whereClause.recording = reqQuery.recording;
        if (reqQuery.sms) whereClause.sms = reqQuery.sms;

        const result = await MANAGER.findAll({
            where: whereClause,
            attributes: ['id', 'name', 'cxc_manager_id', 'recording', 'sms', 'trade'],
            include: { model: ADMIN }
        });
        return resp.successResponse(res, "SUCCESSFLLY_APPLIED", result)
    } catch (error) {
        return resp.failedResponse(res, error.message);
    }
}