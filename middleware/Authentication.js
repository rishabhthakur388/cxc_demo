const jwt = require("jsonwebtoken");
const { manager_user, admin_user } = require("../models/index");
const resp = require('../helper/response');
// require('')

exports.verify_admin = async (req, res, next) => {
    const jwtSecretKey = process.env.key;
    try {
        if (!req.headers.authorization) {
            return resp.failedResponseWithMsg(res, "unauthorized");
        }
        const token = req.headers.authorization.split(" ")[1];
        const verify = jwt.verify(token, jwtSecretKey);
        const verified = await admin_user.findOne({ where: { id: verify.id } });
        if (!verified) {
            return resp.failedResponseWithMsg(res, "USER_NOT_FOUND");
        };
        req.currentUser = verified;
        next();
    } catch (error) {
        return resp.failedResponseWithMsg(res, error.message);
    };
};
exports.verify_manager = async (req, res, next) => {
    const jwtSecretKey = process.env.key;
    try {
        if (!req.headers.authorization) {
            return resp.failedResponseWithMsg(res, "unauthorized");
        }
        const token = req.headers.authorization.split(" ")[1];
        const verify = jwt.verify(token, jwtSecretKey);
        const verified = await manager_user.findOne({ where: { id: verify.id } });
        if (!verified) {
            return resp.failedResponseWithMsg(res, "USER_NOT_FOUND");
        };
        req.currentUser = verified;
        next();
    } catch (error) {
        return resp.failedResponseWithMsg(res, error.message);
    };
};