const resp = require("../helper/response");
const db = require("../models/index");
const ADMIN = db.admin_user;
const MANAGER = db.manager_user;
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');


////////////////////////////////////////////mailtrap//////////////////////////////////////

async function sendEmail(email, html) {

    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "7006f7877a03db",
            pass: "8253a2f6ec4a1a"
        }
    });

    let mailOptions = {
        from: 'admin@cxc.com',
        to: email,
        subject: 'cxc otp',
        html: html
    };

    transport.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

//////////////////////////////////////////sign Up///////////////////////////////////////////////

exports.signUp = [
    body('email').isEmail().notEmpty().withMessage("email is in-valid"),
    body('password').notEmpty().isStrongPassword().withMessage("ENTER_A_STRONG_PASSWORD"),
    body('name').notEmpty().withMessage("ENTER"),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return resp.failedResponseWithMsg(res, errors.array())
            }

            const reqBody = req.body;
            ///////////////////////////////////ADMIN/////////////////////////////////////////

            if (req.body.userType == '0') {
                const findUser = await ADMIN.findOne({
                    where: {
                        email: reqBody.email
                    }
                });
                if (findUser) {
                    return resp.failedResponseWithMsg(res, "USER_ALREADY_EXIST")
                };
                const hassedpassword = await bcrypt.hash(reqBody.password, 10);
                const payload = {
                    name: req.body.name,
                    email: req.body.email,
                    password: hassedpassword
                }
                const createUser = await ADMIN.create(payload);
                return resp.successResponse(res, "SUCCESSFULLY_CREATED", createUser);
            }

            //////////////////////////////////MANAGER/////////////////////////////////////////////////

            else if (reqBody.userType == '1') {
                const findUser = await MANAGER.findOne({
                    where: {
                        email: reqBody.email
                    }
                });
                if (findUser) {
                    return resp.failedResponseWithMsg(res, "USER_ALREADY_EXIST")
                };
                const hassedpassword = await bcrypt.hash(reqBody.password, 10);
                const payload = {
                    name: req.body.name,
                    email: req.body.email,
                    password: hassedpassword,
                };
                const addUser = await MANAGER.create(payload);
                return resp.successResponse(res, "SUCCESSFULLY_CREATED", addUser);
            }
        } catch (error) {
            return resp.failedResponse(res, error.message);
        };
    }];

///////////////////////////////////////////// VERIFICATION /////////////////////////////////////

exports.verification = [
    body('email').notEmpty().isEmail().withMessage("email is in-valid"),
    async (req, res) => {
        try {
            const reqBody = req.body;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return resp.failedResponseWithMsg(res, errors.array())
            }

            /////////////////////////////////// ADMIN /////////////////////////////////////////

            if (reqBody.userType == '0') {
                const findUser = await ADMIN.findOne({
                    where: {
                        email: reqBody.email
                    }
                });
                if (!findUser) {
                    return resp.failedResponseWithMsg(res, "USER_NOT_FOUND");
                }
                else if (!reqBody.otp) {
                    let genrateOtp = Math.floor(Math.random() * 90000) + 10000;
                    let html = `<h1> CxC SIGNUP OTP FOR ADMIN <br><br>
                     Your otp is ${genrateOtp}`;
                    await sendEmail(findUser.email, html);
                    await ADMIN.update({ otp: genrateOtp }, { where: { id: findUser.id } });
                    return resp.successResponse(res, "OTP sent");
                }
                else if (reqBody.otp == findUser.otp) {
                    await ADMIN.update({ otp: null, is_verify: 1 }, {
                        where: {
                            email: req.body.email
                        }
                    });
                    const token = jwt.sign({ id: findUser.id }, process.env.key);
                    return resp.successResponseWithToken(res, "USER_VERIFIED", token);
                } else {
                    return resp.failedResponseWithMsg(res, "INCORRECT_OTP");
                };
            };

            ////////////////////////////////// MANAGER /////////////////////////////////////////////////

            if (reqBody.userType == "1") {
                const findUser = await MANAGER.findOne({
                    where: {
                        email: reqBody.email
                    }
                });
                if (!findUser) {
                    return resp.failedResponseWithMsg(res, "USER_NOT_FOUND");
                }
                else if (!reqBody.otp) {
                    let genrateOtp = Math.floor(Math.random() * 90000) + 10000;
                    let html = `<h1> CxC SIGNUP OTP FOR MANAGER <br><br>
                     Your otp is ${genrateOtp}`;
                    await sendEmail(findUser.email, html);
                    await MANAGER.update({
                        otp: genrateOtp
                    }, {
                        where:
                            { id: findUser.id }
                    });
                    return resp.successResponse(res, "OTP sent");
                }
                else if (reqBody.otp == findUser.otp) {
                    await MANAGER.update({
                        otp: null, is_verify: 1
                    }, {
                        where: {
                            email: req.body.email
                        }
                    });
                    const token = jwt.sign({ id: findUser.id }, process.env.key);
                    return resp.successResponseWithToken(res, "USER_VERIFIED", token);
                } else {
                    return resp.failedResponseWithMsg(res, "INCORRECT_OTP");
                };
            }
        } catch (error) {
            return resp.failedResponse(res, error.message);
        };
    }];

//////////////////////////////////ACCOUNT SETUP//////////////////////////////////////////

exports.account_setup = [
    body('username').notEmpty().isString().withMessage("ENTER_USERNAME"),
    body('client_id').notEmpty().isNumeric().withMessage("ENTER_VALID_CLIENTID"),
    body('client_secret').notEmpty().isString().withMessage("client_secret is in-valid"),
    body('tenant_id').notEmpty().isNumeric().withMessage("email is in-valid"),
    body('app_key').notEmpty().isNumeric().withMessage("email is in-valid"),
    async (req, res) => {
        const reqBody = req.body;
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) { return resp.failedResponseWithMsg(res, errors.array()) }

            ///////////////////////////////////////// ADMIMN ////////////////////////////////////////////////// 

            if (reqBody.userType == '0') {

                const findUser = await ADMIN.findOne({
                    where: {
                        email: reqBody.email
                    }
                })
                const hassedPassword = await bcrypt.compare(req.body.password, findUser.password);
                if (!hassedPassword) {
                    return resp.failedResponseWithMsg(res, "INCORRECT_PASSWORD");
                }
                if (!findUser) {
                    return resp.failedResponseWithMsg(res, "USER_NOT_FOUND");
                }
                if (findUser.is_verify == false) {
                    return resp.failedResponseWithMsg(res, "USER_IS_NOT_VERIFIED");
                }
                if (findUser.id != req.currentUser.id) {
                    return resp.failedResponseWithMsg(res, "WRONG_USER");
                }
                const data = await ADMIN.update({
                    username: reqBody.username,
                    client_id: reqBody.client_id,
                    client_secret: reqBody.client_secret,
                    tenant_id: reqBody.tenant_id,
                    app_key: reqBody.app_key
                }, {
                    where: {
                        id: req.currentUser.id
                    }
                });
                return resp.successResponse(res, "SUCCESSFULLY_ADDED", data);
            }
            ///////////////////////////////////////// MANAGER ////////////////////////////////////////////////// 

            else if (reqBody.userType == '1') {
                const findUser = await MANAGER.findOne({
                    where: {
                        email: reqBody.email
                    }
                });
                if (!findUser) {
                    return resp.failedResponseWithMsg(res, "USER_NOT_FOUND");
                }
                else if (findUser.is_verify == false) {
                    return resp.failedResponseWithMsg(res, "USER_IS_NOT_VERIFIED");
                }
                if (findUser.id != req.currentUser.id) {
                    return resp.failedResponseWithMsg(res, "WRONG_USER");
                }
                const data = await MANAGER.update({
                    username: reqBody.username,
                    client_id: reqBody.client_id,
                    phone_number: reqBody.phone_number,
                    client_secret: reqBody.client_secret,
                    trade: reqBody.trade,
                    recording: reqBody.recording,
                    sms: reqBody.sms,
                    tenant_id: reqBody.tenant_id,
                    app_key: reqBody.app_key
                }, {
                    where: {
                        id: findUser.id,
                        email: reqBody.email
                    }
                });
                return resp.successResponse(res, "SUCCESSFULLY_ADDED", data);
            };
        } catch (error) {
            return resp.failedResponse(res, error.message);
        }
    }];

//////////////////////////////////// UPLOAD ADMIN PROFILE /////////////////////////////////////////////////////////

exports.add_adminProfile = async (req, res) => {
    try {
        const findUser = await ADMIN.findOne({
            where: {
                id: req.currentUser.id
            }
        });
        if (findUser.is_verify == false) {
            return resp.failedResponseWithMsg(res, "USER_IS_NOT_VERIFIED");
        };
        if (!findUser) {
            return resp.failedResponseWithMsg(res, "USER_NOT_FOUND");
        };
        const data = await ADMIN.update({
            profile_picture: req.files[0].filename
        }, {
            where: {
                id: req.currentUser.id
            }
        });
        return resp.successResponse(res, "PROFILE_PICTURE_ADDED", data);
    } catch (error) {
        return resp.failedResponse(res, error.message);
    }
}
/////////////////////////////////////////// forgot_password ////////////////////////////////////

exports.forgot_password = [
    body('email').isEmail().notEmpty().withMessage('IN-VALID_EMAIL'),
    body('password').isEmpty().isStrongPassword().withMessage('ENTER_A_VALID PASSWORD'),
    async (req, res) => {
        const reqBody = req.body;
        try {
            if (reqBody.userType == '0') {
                const findUser = await ADMIN.findOne({
                    where: {
                        email: reqBody.email
                    }
                });
                if (!findUser) {
                    return resp.failedResponseWithMsg(res, "USER_NOT_FOUND");
                }
                let html = `<h1> CxC FORGOT PASSWORD FOR ADMIN <br><br>
                     Your link is ${"localhost:3000/resetpassword"}`;
                await sendEmail(findUser.email, html);
                return resp.successResponseWithoutData(res, "EMAIL_SENT")
            }
            else if (reqBody.userType == '1') {
                const findUser = await MANAGER.findOne({
                    where: {
                        email: reqBody.email
                    }
                });
                if (!findUser) {
                    return resp.failedResponseWithMsg(res, "USER_NOT_FOUND");
                };
                let html = `<h1> CxC FORGOT PASSWORD FOR MANAGER <br><br>
                Your link is ${"localhost:3000/resetpassword"}`;
                await sendEmail(findUser.email, html);
                return resp.successResponseWithoutData(res, "EMAIL_SENT");
            };

        } catch (error) {
            return resp.failedResponseWithMsg(res, error.message);
        };
    }];

//////////////////////////////////////// RESET PASSWORD //////////////////////////////////////////////

exports.reset_password = async (req, res) => {
    const reqBody = req.body;
    try {

        ///////////////////////////////// ADMIN /////////////////////////////////////////

        if (reqBody.userType == '0') {
            const newPassword = reqBody.newPassword;
            const findUser = await ADMIN.findOne({
                where: {
                    email: reqBody.email
                }
            })
            if (!findUser) {
                return resp.failedResponseWithMsg(res, "USER_NOT_FOUND")
            }
            const hassedPassword = await bcrypt.compare(newPassword, findUser.password);
            if (hassedPassword) {
                return resp.failedResponseWithMsg(res, "OLD_PASSWORD")
            };
            const hasspass = await bcrypt.hash(newPassword, 10);
            await ADMIN.update({
                password: hasspass
            }, {
                where: {
                    id: findUser.id
                }
            });
            return resp.successResponse(res, "PASSWORD_CHANGED_SUCCESSFULLY");
        }

        //////////////////////////////// MANAGER /////////////////////////////////////////

        else if (reqBody.userType == '1') {
            const newPassword = reqBody.newPassword;
            const findUser = await MANAGER.findOne({
                where: {
                    email: reqBody.email
                }
            });
            if (!findUser) {
                return resp.failedResponseWithMsg(res, "USER_NOT_FOUND")
            }
            const hassedPassword = await bcrypt.compare(reqBody.newPassword, findUser.password);
            if (hassedPassword) {
                return resp.failedResponseWithMsg(res, "OLD_PASSWORD")
            };
            const hasspass = await bcrypt.hash(newPassword, 10);
            await MANAGER.update({
                password: hasspass
            }, {
                where: {
                    id: findUser.id
                }
            });
            return resp.successResponse(res, "PASSWORD_CHANGED_SUCCESSFULLY");
        }
    } catch (error) {
        return resp.failedResponse(res, error.message);
    }
}

//////////////////////////////////////////// LOGIN ////////////////////////////////////////////

exports.login = [
    body('email').isEmail().notEmpty().withMessage('ENTER_A_VALID_EMAIL'),
    body('password').notEmpty().withMessage('ENTER_PASSWORD'),
    async (req, res) => {
        try {
            const reqBody = req.body

            /////////////////////////////////// ADMIN /////////////////////////////////////////
            if (reqBody.userType == '0') {
                const findUser = await ADMIN.findOne({
                    where: {
                        email: reqBody.email
                    }
                });
                if (!findUser) {
                    return resp.failedResponseWithMsg(res, "USER_NOT_FOUND")
                };
                const verifyPassword = await ADMIN.findOne({
                    where: {
                        email: reqBody.email
                    }
                });
                const hassedPassword = await bcrypt.compare(reqBody.password, verifyPassword.password);
                if (!hassedPassword) {
                    return resp.failedResponseWithMsg(res, "INCORRECT_PASSWORD")
                };
                const token = jwt.sign({ id: findUser.id }, process.env.key);
                return resp.successResponseWithToken(res, "LOGIN_SUCCESSFUL", token);
            }

            ////////////////////////////////// MANAGER /////////////////////////////////////////////////

            if (reqBody.userType == '1') {
                const findUser = await MANAGER.findOne({
                    where: {
                        email: reqBody.email
                    }
                });
                if (!findUser) {
                    return resp.failedResponseWithMsg(res, "USER_NOT_FOUND")
                };
                const verifyPassword = await MANAGER.findOne({
                    where: {
                        email: reqBody.email
                    }
                });
                const hassedPassword = await bcrypt.compare(reqBody.password, verifyPassword.password);
                if (!hassedPassword) {
                    return resp.failedResponseWithMsg(res, "INCORRECT_PASSWORD")
                };
                const token = jwt.sign({ id: findUser.id }, process.env.key);
                return resp.successResponseWithToken(res, "LOGIN_SUCCESSFUL", token);
            }
        } catch (error) {
            return resp.failedResponse(res, error.message);
        }
    }];

//////////////////////////////////////////GET TOKKEN//////////////////////////////////////////

///////////////////////////////////// MANAGER //////////////////////////////////////////

exports.get_token_manager = async (req, res) => {
    try {
        return resp.successResponse(res, "SUCCESS", req.currentUser);
    } catch (err) {
        return resp.failedResponse(res, err.message);
    }
};
///////////////////////////////////// ADMIN //////////////////////////////////////////
exports.get_token_admin = async (req, res) => {
    try {
        return resp.successResponse(res, "SUCCESS", req.currentUser);
    } catch (err) {
        return resp.failedResponse(res, err.message);
    }
};
