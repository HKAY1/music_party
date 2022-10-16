'use strict'


const mongoose = require('mongoose');

const bcrypt = require('bcrypt');
const ObjectId = mongoose.Types.ObjectId;
const UserModel = mongoose.model('user');
const BaseRepo = require('app/Repositories/baseRepository');
const {generateJWT, checkMissingFields, isValidMongoObjectId } = require('utils/commonFunctions');
const _ = require('lodash');
const { userRoles,genders,accountStatus} = require('models/lookup');

module.exports = {
    toggleAccountStatus,
    registerUser,
    updateUser,
    userList,
    userDetail,
    //delteUser,
}

const userFields = ["name", "address", "gender","role","password","email","phoneNumber"];

async function toggleAccountStatus(req, res, next){
    const body = req.body;
    if (!req.params.id)
        return next({ message: "missing account id from params", status: 400 });
    if (!isValidMongoObjectId(req.params.id)) 
        return next({ message: "Invalid account id", status: 400 });

    const accountId = ObjectId(req.params.id);
    if(!body || _.isEmpty(body)) return next({ message: "Some fields are missing", fields: ["status", "role"]})
    if (!body.status || !accountStatus.includes(body.status)) {
        return next({ message: "Missing or invalid status", status: 400 });
    }
    if (!body.role || !userRoles.includes(body.role)) {
        return next({ message: "Missing or invalid role", status: 400 });
    }
    
    try{
       const user = await BaseRepo.baseUpdate(UserModel, {_id: accountId}, {status: body.status});
       if(!user) return next({message: "User not found.", status: 400});

       res.data = { message: "User status updated successfully."};
       return next();
    }
    catch(err){
     return next(err);
    }
}




async function registerUser(req, res, next) {
    let body = req.body;
    let userbody = _.pick(body, userFields);

    let missingUserFields = checkMissingFields(body,userFields);
    if (missingUserFields.length) return next({ message: "Some fields are missing", fields: _.uniq([...missingUserFields]), status: 400 });
    if(!genders.includes(userbody.gender)) return next({ message: "Invalid Gender, Gender Must Be (Male, Female)", status: 400 });
    if(!userRoles.includes(userbody.role)) return next({ message: "Invalid Role", status: 400 });
    

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const opts = { session, new: true };
        
        const user = await BaseRepo.baseCreate(UserModel, userbody,opts);

        if(!user) {
            await session.abortTransaction();
            session.endSession();
            return next({ message: "Internal Serever Error" });
        }
        const token = generateJWT({ userId: user._id, role: user.role});
      
        
        res.data = {token};

        await session.commitTransaction();
        session.endSession();
 

        return next();
    }
    catch (err) {
        await session.abortTransaction();
        session.endSession();
        return next(err);
    }
}

async function updateUser(req, res, next) {

    var userId ;

    if (!req.query.id)
        userId = ObjectId(req.user._id);
        else userId = ObjectId(req.query.id);

    let body = req.body;

    body = _.pick(body, ["name", "address","gender"]);
 
    try {

        let user = await BaseRepo.baseDetail(UserModel, { _id: userId });

        if (!user) return next({ message: "User not found", status: 400 });

        await BaseRepo.baseUpdate(UserModel, { _id: userId }, body);

        res.data = { message: "Successfully updated " };

        return next();

    } catch (err) {
        return next(err)
    }
}

async function delteUser(req, res, next) {

    if (!req.params.id)
        return next({ message: "missing id from params", status: 400 });
    if (!isValidMongoObjectId(req.params.id)) {
        return next({ message: "Invalid  id", status: 400 });
    }

    const userId = ObjectId(req.params.id);


 
    try {

        let user = await BaseRepo.baseDetail(UserModel, { _id: userId });

        if (!user) return next({ message: "User not found", status: 400 });

        await BaseRepo.baseDelete(UserModel, { _id: userId });

        res.data = { message: "Successfully updated " };

        return next();

    } catch (err) {
        return next(err)
    }
}

async function userList(req, res, next) {
    let { filter, name } = req.query;
    var searchParams = {};
    if(filter) searchParams.role = filter;
    if(name) searchParams.name = {$regex : `^${name}`, '$options' : 'i'};
    let params = {
        searchParams,
        limit: 10,
        // select: 'name imageUrl'

    };


    try {

        let users = await BaseRepo.baseList(UserModel, params);

        if (!users || !users.length)
            res.data = [];
        else
            res.data = users;

        return next();

    } catch (err) {
        return next(err);
    }
}

async function userDetail(req, res, next) {

    if (!req.params.id)
        return next({ message: "Missing User id from params", status: 400 });

    if (!isValidMongoObjectId(req.params.id)) 
        return next({ message: "Invalid User id", status: 400 });
    
    const userId = ObjectId(req.params.id);


    try {
        const user = await BaseRepo.baseDetailById(UserModel, userId);

        if (!user) return next({ message: "User Not Found" })

        res.data = user;

        return next();

    } catch (err) {
        return next(err);
    }
} 
