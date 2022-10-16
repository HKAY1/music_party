var _ = require('lodash');

// for calculating highest depth of an object
var depthOf = function (object) {
    var level = 0;
    var key;
    for (key in object) {
        if (!object.hasOwnProperty(key)) continue;

        if (typeof object[key] == 'object') {
            var depth = depthOf(object[key]) + 1;
            level = Math.max(depth, level);
        }
    }
    return level;
};

// for deleting null string
function delete_null_properties(test) {
    for (var i in test) {
        if (test[i] === '') {
            delete test[i];
        } else if (Array.isArray(test[i]) && test[i] && !test[i][0]) {
            delete test[i];
        } else if (typeof test[i] === 'object') {
            delete_null_properties(test[i]);
        }
    }
}

// for deleting null objects or empty arrays
function delete_Empty_Objects(test) {
    for (var i in test) {
        if (typeof test[i] === 'object') {
            if (_.isEmpty(test[i])) {
                delete test[i];
            } else {
                delete_Empty_Objects(test[i]);
            }
        }
    }
}


module.exports = {
    parse: function preRequest(req, res, next) {
        var filterObj = _.cloneDeep(req.query) || {};
        var searchQuery = {};
        var sortBy = {};
        var limit = 20;
        var skip = 0;
        if (!_.isEmpty(filterObj)) {
            var page = Math.max(1, filterObj.page);
            delete filterObj.page;
            var delimiter = "_";

            //for limit checking integer and greater than zero
            if (filterObj.limit && parseInt(filterObj.limit) !== NaN && parseInt(filterObj.limit) > 0) {
                limit = parseInt(filterObj.limit);
                if (filterObj.limit > 1000) {
                    limit = 100;
                }
            }
            delete filterObj.limit;
            //for skip checking integer and greater than zero
            skip = limit * (page - 1);

            delete filterObj.skip;

            //for sort expecting string for multi sort fields expecting with comma and sortDir default is 1
            if (filterObj.sort && typeof filterObj.sort == "string") {
                if (filterObj.sortDir && _.indexOf(["-1", "1"], filterObj.sortDir) !== -1) {
                    sortBy[filterObj.sort] = parseInt(filterObj.sortDir);
                } else {
                    sortBy[filterObj.sort] = 1;
                }
            } else {
                sortBy["_id"] = -1;  //default if there is no sort
            }
            delete filterObj.sort;
            delete filterObj.sortDir;
            //for remaining fields except sort,skip,limit
            var keys;
            var values;

            function getValue(filterObj, filter, key, value) {
                var values = value;
                if (filter == 'in' || filter == 'nin') {
                    values = value.split(',');
                    if (filterObj[key + delimiter + "date"]) {
                        values = values.map(function (val) {
                            new Date(val).toISOString();
                        })
                    } else {
                        values = value.split(',');
                    }
                } else {
                    if (filterObj[key + delimiter + "date"]) {
                        if (!isNaN(Date.parse(value))) {
                            values = new Date(value).toISOString();
                        }
                    } else {
                        values = value
                    }
                }
                return values;
            }

            _.forEach(filterObj, function (value, key) {
                if (value && typeof value == "string") {
                    if (key && key.indexOf(delimiter) !== -1) {
                        keys = key.split(delimiter);
                        var value1 = getValue(filterObj, keys[1], keys[0], value);
                        if (keys[1] == "min" && parseInt(value) !== NaN) {
                            if (searchQuery[keys[0]]) {
                                searchQuery[keys[0]]["$gte"] = parseInt(value1);
                            } else {
                                searchQuery[keys[0]] = {$gte: parseInt(value1)};
                            }
                        } else if (keys[1] == "max" && parseInt(value) !== NaN) {
                            if (searchQuery[keys[0]]) {
                                searchQuery[keys[0]]["$lte"] = parseInt(value1);
                            } else {
                                searchQuery[keys[0]] = {$lte: parseInt(value1)};
                            }
                        } else if (keys[1] == "neq" && parseInt(value) !== NaN) {
                            searchQuery[keys[0]] = {$ne: value};
                        } else if (keys[1] == "like" && typeof value === "string") {
                            searchQuery[keys[0]] = new RegExp(value, 'i');
                        } else if (keys[1] == "in") {
                            searchQuery[keys[0]] = {$in: value1};
                        } else if (keys[1] == "exists") {
                            searchQuery[keys[0]] = (value === "true") ? {$ne: null} : {$eq: null};
                        }
                        else if (keys[1] == "nin") {
                            searchQuery[keys[0]] = {$nin: value1};
                        }
                        /*if(!searchQuery[keys[0]]){
                            searchQuery[keys[0]] = {};
                        }
                        if(keys[1] != "date"){
                            searchQuery[keys[0]][keys[1]] = values;
                        }*/
                    } else if (value && typeof value == "string") {
                        searchQuery[key] = value;
                    }
                }
            });
        }
        req.limit = limit;
        if (!req.query.skip) {
            req.skip = skip;
        } else {
            req.skip = parseInt(req.query.skip);
        }
        req.sortBy = sortBy;
        req.searchQuery = searchQuery;

        //parsing empty objects or array or empty string and deleting the empty key
        try {
            if ((req.method == "POST" || req.method == "PUT") && req.body) {
                var level = depthOf(req.body);
                for (var i = 0; i <= level; i++) {
                    delete_null_properties(req.body);
                    delete_Empty_Objects(req.body);
                }
            }
        } catch (e) {
            //continue without parsing
        }
        next();
    }
};

