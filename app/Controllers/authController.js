'use strict'

const _ = require('lodash');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const UserModel = mongoose.model('user');
const lookup = require('models/lookup');
const { generateJWT, checkMissingFields, isValidMongoObjectId, generateOtp } = require('utils/commonFunctions');
const BaseRepo = require('app/Repositories/baseRepository');

const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = {
    logiWithPassword
}


async function logiWithPassword(req, res, next) {
    const body = req.body;

    if (!body['userName']) {
        return next({ message: "UserName is required", status: 400 });
    }
    if (!body['password']) {
        return next({ message: "password is required", status: 400 });
    }


    try {
        const userMetaParam = {
            searchParams: {
                name:body.userName
            }
        };
        let usermeta = await BaseRepo.baseDetail(UserModel, userMetaParam);

        if (!usermeta) {
            return next({ message: "Incorrect UserName.", status: 400 });
        }

        //check for password match
        const isMatch = await usermeta.comparePassword(body.password);

        if (!isMatch) {
            return next({ message: "Incorrect Password", status: 400 })
        }

        //get user role & status
        let user = await BaseRepo.baseDetail(UserModel, {
            searchParams: {
                _id: ObjectId(usermeta._id),
                status: 'Active'
            }
        });
        if (!user) return next({ message: "Account not found or has been blocked.", status: 400 });

        //generate a token for the user
        const token = generateJWT({ userId: user._id, role: user.role });
        res.data = { token };
        return next();
    }
    catch (err) {
        console.log('Error in login : ', err);
        return next(err);
    }
}
