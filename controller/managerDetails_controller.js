const resp = require("../helper/response");
const db = require("../models/index");
const MANAGER = db.manager_user;
const PROFILE = db.manager_details;
const { body, validationResult } = require('express-validator');



exports.manager_profile = [
    body('phone_number').notEmpty().isMobilePhone().isLength({ min: 10, max: 10 }).withMessage("ENTER_A_VALID_PHONENUMBER"),
    async (req, res) => {
        const reqBody = req.body;
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return resp.failedResponseWithMsg(res, errors.array());
            };
            const findUser = await MANAGER.findOne({
                where: {
                    id: req.currentUser.id
                }
            });
            const findDetails = await PROFILE.findOne({
                where: {
                    phone_number: reqBody.phone_number
                }
            });
            if (!findUser) {
                return resp.failedResponseWithMsg(res, "USER_NOT_FOUND");
            }
            if (findDetails) {
                return resp.failedResponseWithMsg(res, "DETAILS_ALREADY_EXISTS");
            }
            if (findUser.recording == '0') {
                return resp.failedResponseWithMsg(res, "ACCESS_DENIED");
            }
            if (findUser.sms == '0') {
                return resp.failedResponseWithMsg(res, "ACCESS_DENIED");
            }

            let pp = "", rec = "";
            req.files.map(doc => {
                if (doc.fieldname == "recording") {
                    rec = doc.filename;
                }
                if (doc.fieldname == "profile_picture") {
                    pp = doc.filename;
                }
            });
            const payload = {
                manager_id: req.currentUser.id,
                profile_picture: pp,
                phone_number: reqBody.phone_number,
                recording: rec,
                sms: reqBody.sms
            };
            const data = await PROFILE.create(payload);
            return resp.successResponse(res, "SUCCESSFULL_ADDED", data)
        } catch (error) {
            return resp.failedResponseWithMsg(res, error.message);
        };
    }];


exports.getrecording = async (req, res) => {
    try {
        const findUser = await MANAGER.findOne({
            where: {
                id: req.currentUser.id
            },
            attributes: ['id', 'name'],
            include: {
                model: PROFILE,
                attributes: ['id', 'profile_picture', 'recording', 'sms', 'createdAt']
            }
        });
        if (!findUser) {
            return resp.failedResponseWithMsg(res, "USER_NOT_FOUND");
        };
        return resp.successResponse(res, "SUCCESSFUL", findUser);
    } catch (error) {
        return resp.failedResponse(res, error.message);
    }
}