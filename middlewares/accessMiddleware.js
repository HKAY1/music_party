'use strict'

module.exports.allowedRoles = (...roles) =>{
    return (
        (req, res, next) =>{
            if(req.user && roles.some(r=> r === req.user.role))
                return next();
            return next({message: 'Not authorized to access this resource',  status: 403});    
        }
    )
}