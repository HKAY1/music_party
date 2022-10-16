'use strict'

const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
const UserModel = mongoose.model('user');
// const OrganisationModel = mongoose.model('organisation');

module.exports = (req, res, next) => {
        
        const authHeader = req.header('authorization');
        const userToken = authHeader && authHeader.split(' ')[1];
        
        if(!userToken){
           return res.status(401).json({message: "Unauthorised Access"});
        }
    
        jwt.verify(userToken, _config.jwt_secret, (err, data)=>{
           if(err){
               return res.status(403).json({message: "Invalid token"});
           }
           console.log('jwt payload --> ', data);
    
          // if(!data.userId || !data.role) return res.status(400).json({message: "Session Expired. Please login again."});
           
           let entityModel = UserModel;
        //    if(['Admin', 'SubAdmin'].includes(data.role))
        //          entityModel = UserModel;
        //    else if(['SubContractor', 'Architect'].includes(data.role))
        //          entityModel = UserModel;

           if(!entityModel) return res.status(500).json({message: "Something went wrong!"});
  
           entityModel.findById(data.userId).exec( function(err, user){
               if(err){
                   return res.status(500).json('Internal Server Error');
               }
               
               if(user && user.status !== 'Active'){
                    return res.status(403).json({message: "This account is currently not active."});
                }
                
                req.user = user;
                return next();
           });
        });
    }

