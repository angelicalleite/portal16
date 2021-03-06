"use strict";
let _ = require('lodash'),
    camelCase = require('camelcase'),
    Q = require('q'),
    http = require('http'),
    moment = require("moment"),
    url = require('url'),
    helper = rootRequire('app/models/util/util'),
    intervalTypes = ['YEAR', 'EVENT_DATE', 'ELEVATION', 'DEPTH'];

/**
 * Add key describing the type of children. If they are all predicates with the same key, the parent will get eg. prop _childKeys = '[MONTH]'. if different then _childKeys = 'MIXED'
 * will also add depth in tree and max depth of children
 * @param predicate
 * @param depth
 * @returns {*}
 */
function addChildKeys(predicate) {
    if (!predicate) {
        throw new Error('failed to parse predicate');
    } else if (!predicate.predicates && !predicate.predicate) {
        if (predicate.type == 'within') {
            predicate.key = 'GEOMETRY';
            predicate.value = predicate.geometry;
        }
        predicate._childKeys = predicate.key;
    } else if(predicate.predicate) {
        var child = addChildKeys(predicate.predicate);
        predicate._childKeys = child._childKeys;
    } else {
        var children = predicate.predicates.map(function(p){
            return addChildKeys(p);
        });
        var keys = children.map(function(c){
            return c._childKeys;
        });
        keys = _.intersection(keys);
        if (keys.length == 1) {
            predicate._childKeys = keys[0];
        } else {
            predicate._childKeys = 'MIXED';
        }
    }
    return predicate;
}

function setDepths(predicate, depth) {
    depth = depth || 0;
    depth++;
    if (!predicate) {
        throw new Error('failed to parse predicate');
    } else if (!predicate.predicates && !predicate.predicate) {
        predicate._maxDepth = depth;
    } else if(predicate.predicate) {
        var child = setDepths(predicate.predicate, depth);
        predicate._maxDepth = Math.max(child._maxDepth, predicate._maxDepth || 0);
    } else {
        var children = predicate.predicates.map(function(p){
            return setDepths(p, depth);
        });
        var max = _.maxBy(children, '_maxDepth')._maxDepth;
        predicate._maxDepth = max;
    }

    predicate.depth = depth;
    return predicate;
}

/***
 * if an OR predicate and all child predicates are of the same type, then flatten to IN type
 * @param predicate
 */
function flattenSameType(predicate) {
    if (!predicate) {
        throw new Error('failed to parse predicate');
    } else if (predicate.type == 'or' && predicate._childKeys !== 'MIXED' && predicate.depth+1 === predicate._maxDepth) {
        //flatten
        predicate.type = 'in';
        predicate.key = predicate._childKeys;
        predicate.values = _.map(predicate.predicates, 'value');
        predicate._maxDepth--;
    } else if (predicate.predicate) {
        flattenSameType(predicate.predicate);
    } else if(predicate.predicates) {
        predicate.predicates.forEach(function(p){
            flattenSameType(p);
        });
    }
}


function istype(type) {
    return function(e){
        return e.type === type;
    }
}
function addSyntheticTypes(predicate) {
    if (!predicate) {
        throw new Error('failed to parse predicate');
    } else if ( predicate.type == 'and' &&
        intervalTypes.indexOf(predicate._childKeys)>=0 &&
        predicate.predicates.length == 2 &&
        predicate.predicates.find(istype('greaterThanOrEquals')) &&
        predicate.predicates.find(istype('lessThanOrEquals'))
    )
    {
        var gt = predicate.predicates.find(istype('greaterThanOrEquals')),
            lt = predicate.predicates.find(istype('lessThanOrEquals'));
        predicate.type = 'between';
        predicate.predicates = undefined;
        predicate.key = predicate._childKeys;
        if (predicate._maxDepth) predicate._maxDepth = predicate._maxDepth - 1;
        predicate.value = gt.value + ',' + lt.value;
        predicate.from = gt.value;
        predicate.to = lt.value;
    } else if (predicate.predicate) {
        addSyntheticTypes(predicate.predicate);
    } else if(predicate.predicates) {
        predicate.predicates.forEach(function(p){
            addSyntheticTypes(p);
        });
    }
}

function getSimpleQuery(predicate) {
    if (!predicate) {
        throw new Error('failed to parse predicate');
    } else if(['or', 'not'].indexOf(predicate.type) !== -1 || predicate._maxDepth > 3) {
        return false;
    } else if(predicate.type === 'and') {
        //validate that elements have different childkeys and none of them are MIXED and have OR or leaf type
        var invalidPredicate = _.find(predicate.predicates, function(p){
            return p.type == 'and' || p.type == 'not' || p._childKeys == 'MIXED'; //only leafs and OR queries of a single TYPE allowed
        });
        if (invalidPredicate) {
            return false;
        }
    }
    //serialize query to occurrence site search string
    var queryString = _.join(_.flattenDeep(attachPredicatesAsParams(predicate)), '&');
    return queryString;
}

function attachPredicatesAsParams(predicate) {
    let queryList = [];
    if (!predicate) {
        throw new Error('failed to parse predicate');
    } else if (predicate.predicate){
        queryList.push(attachPredicatesAsParams(predicate.predicate));
    } else if(predicate.predicates) {
        let queries = predicate.predicates.map(function(p){
            return attachPredicatesAsParams(p);
        });
        queryList.push(queries);
    } else {
        if (!_.isUndefined(predicate.key) && !_.isUndefined(predicate.value)) {
            let val = predicate.value;
            if (predicate.type === 'greaterThanOrEquals') {
                val += ',*';
            }
            if (predicate.type === 'lessThanOrEquals') {
                val = '*,' + val;
            }
            queryList.push(predicate.key.toLowerCase() + '=' + encodeURIComponent(val));
        } if (!_.isUndefined(predicate.geometry)) {
            queryList.push('geometry=' + encodeURIComponent(predicate.geometry));
        }
    }
    return queryList;
}

//returns a list of tasks to be run by async. Each task will add the looked up value to the predicate. Predicate with taxonKey will for example be attached the coresponding species
function addpredicateResolveTasks(predicate, config, tasks, __mf) {
    if (!predicate) {
        throw new Error('failed to parse predicate');
    } else {
        let camelKey = camelCase(_.get(predicate, 'key', ''));
        let keyResolver = config[camelKey];
        if (keyResolver) {
            if (keyResolver.type == 'ENDPOINT') {
                //create task
                addEndpointTask(predicate, keyResolver, tasks);
            } else if(keyResolver.type == 'ENUM') {
                resolveEnum(predicate, keyResolver, __mf);
            }
        }

        if (predicate.predicates) {
            predicate.predicates.forEach(function(p){
                addpredicateResolveTasks(p, config, tasks, __mf);
            });
        }
        if (predicate.predicate) {
            addpredicateResolveTasks(predicate.predicate, config, tasks, __mf);
        }
    }
    return tasks;
}

//given a predicate and a resolver configuration then translate the enum into something readable. fx "above 500 meters"
function resolveEnum(predicate, config, __mf) {
    if (intervalTypes.indexOf(predicate.key) !== -1 ) {
        if (predicate.type == 'between') {
            predicate.value = __mf(config.valueTranslation + predicate.type, {from: predicate.from, to: predicate.to})
        } else if (predicate.type == 'lessThan') {
            predicate.value = __mf(config.valueTranslation + 'lessThanOrEquals', {to: predicate.value})
        } else if (predicate.type == 'greaterThan') {
            predicate.value = __mf(config.valueTranslation + 'greaterThanOrEquals', {from: predicate.value})
        } else {
            predicate.value = __mf(config.valueTranslation + predicate.type, {from: predicate.value, to: predicate.value})
        }
    } else if (predicate.type == 'in') {
        predicate.values = predicate.values.map(function(e){
            return __mf(config.valueTranslation + e)
        });
    } else {
        predicate.value = __mf(config.valueTranslation + predicate.value)
    }
}

function addEndpointTask(predicate, config, tasks) {
    if (predicate.type == 'in') {
        let listPromise = Promise.all(predicate.values.map(function(value){
            return getResource(config.url + value);
        })).then(function(values){
            predicate.values = _.map(values, config.field);
        });
        tasks.push(listPromise);
    } else {
        let itemPromise = getResource(config.url + predicate.value).then(function(e){
                predicate.value = e[config.field];
            })
            .catch(function(){
                predicate.value = predicate.value;
            });
        tasks.push(itemPromise);
    }
}

function getResource(url, failSilently) {
    var options = {
        url: url,
        retries: 3,
        timeout: 30000,
        failHard: !failSilently
    };
    return requestPromise(options);
}

function requestPromise(queryOptions) {
    var deferred = Q.defer();
    helper.getApiData(queryOptions.url, function (err, data) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(data);
        }
    }, queryOptions);
    return deferred.promise;
}


function isFileAvailable(download) {
    let creationDate = download.record.created,
        yesterday, created;
    if (creationDate) {
        yesterday = moment().subtract(1, 'day');
        created = moment(download.record.created);
    }

    var deferred = Q.defer();
    var fileUrl = _.get(download, 'record.downloadLink'),
        status = _.get(download, 'record.status', 'KILLED'),
        options;
    if (status !== 'SUCCEEDED' || !_.isString(fileUrl)) {
        download.isFileAvailable = false;
        deferred.resolve(false);
    } else {
        options = {
            method: 'HEAD',
            host: url.parse(fileUrl).host,
            port: 80,
            path: url.parse(fileUrl).pathname
        };
        var req = http.request(options, function (r) {
            download.isFileAvailable = r.statusCode == 200;
            //if not available and status==succeeded then is must have been deleted/removed - but to be sure then require creation date to be older than yesterday - we should delete things only just created anyhow
            download.isFileDeleted = !download.isFileAvailable && creationDate && created.isBefore(yesterday);
            deferred.resolve(r.statusCode == 200);
        });
        req.end();
    }
    return deferred.promise;
}

module.exports = {
    addChildKeys: addChildKeys,
    flattenSameType: flattenSameType,
    addSyntheticTypes: addSyntheticTypes,
    getSimpleQuery: getSimpleQuery,
    addpredicateResolveTasks: addpredicateResolveTasks,
    getResource: getResource,
    isFileAvailable: isFileAvailable,
    setDepths: setDepths
};