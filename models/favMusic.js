'use strict'

const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema;
const fields = {
    userId: {
        type: ObjectId,
        ref:'user',
        required: true
    },
    songId: {
       type: ObjectId,
       ref: 'music',
       required:true
    },
    isLiked: {
        type: Boolean,
        default:false
    }
};



module.exports = mongoose.model('favMusic', fields);


