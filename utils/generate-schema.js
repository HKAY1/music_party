'use strict'

const { Schema } = require("mongoose");
const _ = require('lodash');
const baseSchema = require('models/base-schema');


module.exports = function(fields,alter=false,altSchema){
       const finalFields = (alter)?_.assignIn(_.cloneDeep(baseSchema) || altSchema , fields):fields;
       const finalSchema = new Schema(finalFields);
    return finalSchema;
};