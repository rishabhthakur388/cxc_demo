const resp = require("../helper/response");
const db = require("../models/index");
const PAYMENTINFO = db.payment_details;
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');


exports.payment_details = [
    body('nameOnCard').notEmpty().isString().withMessage("ENTER_NAME"),
    body('card_number').notEmpty().isNumeric().isCreditCard().withMessage("ENTER_VALID_CARDNUMBER"),
    body('expiry').notEmpty().withMessage("enter expiry date"),
    body('cvv').notEmpty().isNumeric().withMessage("enter a valid cvv"),
    body('cardType').notEmpty().withMessage("please select a card type"),
    async (req, res) => {

        const reqBody = req.body;
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return resp.failedResponseWithMsg(res, errors.array());
            };
            const findUser = await PAYMENTINFO.findOne({
                where: {
                    card_number: reqBody.card_number
                }
            });
            if (findUser) {
                return resp.failedResponseWithMsg(res, "DETAILS_ALREADY EXISTS");
            };
            const hassedcvv = await bcrypt.hash(reqBody.cvv, 10);
            const payload = {
                user_id: req.currentUser.id,
                userType: reqBody.userType,
                cardType: reqBody.cardType,
                nameOnCard: reqBody.nameOnCard,
                card_number: reqBody.card_number,
                expiry: reqBody.expiry,
                cvv: hassedcvv,
            }
            const data = await PAYMENTINFO.create(payload);
            return resp.successResponse(res, "SUCCESSFULLY_ADDED", data);

        } catch (error) {
            return resp.failedResponse(res, error.message);
        }
    }]