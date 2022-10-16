require('dotenv').config();//instatiate environment variables

let CONFIG = {}//Make this global to use all over the application



CONFIG.app = process.env.APP || 'dev';
CONFIG.appUrl = process.env.APP_URL;
CONFIG.port = process.env.PORT || '2331';
CONFIG.node_env = process.env.NODE_ENV;

CONFIG.admin_email_id = process.env.ADMIN_EMAIL_ID;
CONFIG.admin_email_pass = process.env.ADMIN_EMAIL_PASS;

CONFIG.mongoose = {
    uri: process.env.MONGOOSE_URI_DEV,
    dbName: process.env.MONGOOSE_DB_NAME,
    dbPassword:process.env.MONGOOSE_DB_PASSWORD_DEV,
}

CONFIG.development = {
    mongoose:{
        uri: process.env.MONGOOSE_URI_DEV,
        dbName: process.env.MONGOOSE_DB_NAME,
        dbPassword:process.env.MONGOOSE_DB_PASSWORD_DEV,
    }
};

CONFIG.production = {
    mongoose:{
        uri: process.env.MONGOOSE_URI_DEV,
        dbName: process.env.MONGOOSE_DB_NAME,
        dbPassword:process.env.MONGOOSE_DB_PASSWORD_DEV,
    }
};
CONFIG.jwt_secret = process.env.JWT_SECRET;

module.exports = CONFIG;