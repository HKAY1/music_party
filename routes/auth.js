const router = require('express').Router();
const AuthController = require('app/Controllers/authController');
const authCheck = require('middlewares/authMiddleware');
const accessCheck = require('middlewares/accessMiddleware');
const jwt = require("jsonwebtoken");

// function extractMetaToken(req, res, next){
//     const authHeader = req.header('authorization');
//     const metaToken = authHeader && authHeader.split(' ')[1];
        
//         if(!metaToken){
//            return res.status(401).json({message: "Unauthorised Access"});
//         }
    
//         jwt.verify(metaToken, _config.jwt_secret, (err, data)=>{
//            if(err){
//                return res.status(403).json({message: "Invalid token"});
//            }
//            console.log('jwt meta data payload --> ', data);

//            req.metaId = data.metaId;
//            return next();
//         }); 
// }
    
router.post('/password-login', AuthController.logiWithPassword);
// router.post('/otp-login', AuthController.loginWithOTP);


// router.get('/profile', authCheck, AuthController.getMyProfile);
// router.post('/password/forgot',  AuthController.forgotPassword);
// router.post('/password/verify-otp', AuthController.verifyOtpForPasswordChange);

// router.post('/password/change',authCheck, AuthController.changePassword);

module.exports = router;