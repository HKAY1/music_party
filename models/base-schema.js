'use strict'

const mongoose = require('mongoose');
const { Schema } = mongoose;

const basicFields = {
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}

module.exports = basicFields;