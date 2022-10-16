'use strict'

const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const ObjectId  = mongoose.Types.ObjectId;

module.exports = {
    generateJWT,
    checkMissingFields,
    removeFalseFields,
	isValidMongoObjectId,
	getHourFromDate,
	generateOtp,
	generateReferralCode
}

function generateJWT(payload, time="200d") {
	const options = {
		expiresIn: time
	}
	return jwt.sign(payload, _config.jwt_secret, options);
}

function checkMissingFields(obj, fieldsList) {

	let missingFields = [];

	fieldsList.forEach(el => {
		if(!Object.keys(obj).includes(el)) missingFields.push(el);
	});

	return missingFields;

}

function removeFalseFields(obj, exceptions=[]) {
	for(let key in obj)
		if(!obj[key] && !exceptions.includes(key))
			delete obj[key]
	return obj;

}
function EpochToDate(epoch) {
    if (epoch < 10000000000)
        epoch *= 1000; // convert to milliseconds (Epoch is usually expressed in seconds, but Javascript uses Milliseconds)
    var epoch = epoch + (new Date().getTimezoneOffset() * -1); //for timeZone        
    return new Date(epoch);
}

function dateToEpoch(date){
// var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' /*,hour:'numeric',minute:'numeric',second:'numeric'*/};
	// let today = new Date();
	return Date.parse(date)/1000;
}

function isValidMongoObjectId(objId){
    objId = objId.toString();
	return ObjectId.isValid(objId);
}

function getHourFromDate(date){
	let nDate = new Date(date);
	const hr = nDate.getUTCHours();
	const min =+(nDate.getUTCMinutes()/60).toFixed(2);
  
	return hr+min;
  };

function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000);
}

function generateReferralCode(length) {
    length = length ? (length + 2) : 8;
    return Math.random().toString(36).substring(2, length);
}  