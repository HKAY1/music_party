'use strict'

const mongoose = require('mongoose');
const { Schema } = mongoose;

const fields = {
    songName: {
        type: String,
        required: true
    },
    singer: {
       type: String,
       default: ""
    },
    linkedTo: {
        type: String,
        default:""
    },
    dateOfRelease: {
        type: String,
    },
    songUrl: {
        type: String,
    }
};



module.exports = mongoose.model('music', fields);


