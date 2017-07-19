"use strict";
var apiConfig = rootRequire('app/models/gbifdata/apiConfig'),
    config = rootRequire('config/config'),
    querystring = require('querystring'),
    request = require('requestretry'),
    _ = require('lodash'),
    backboneQuery = {
        datasetKey: config.backboneDatasetKey
    };

module.exports = {
    installation: {intervals: getInstallationIntervals, list: getInstallationList },
    species: {intervals: getSpeciesIntervals, list: getSpeciesList },
    dataset: {intervals: getDatasetIntervals, list: getDatasetList },
    node: {intervals: getNodeIntervals, list: getNodeList },
    network: {intervals: getNetworkIntervals, list: getNetworkList },
    publisher: {intervals: getPublisherIntervals, list: getPublisherList }
};

function getSpeciesIntervals() {
    return getIntervals(apiConfig.taxonSearch.url, backboneQuery);
}
function getSpeciesList(query) {
    query.datasetKey = backboneQuery.datasetKey;
    return getList(apiConfig.taxonSearch.url, query);
}

function getDatasetIntervals() {
    return getIntervals(apiConfig.datasetSearch.url, {});
}
function getDatasetList(query) {
    return getList(apiConfig.datasetSearch.url, query);
}

function getPublisherIntervals() {
    return getIntervals(apiConfig.publisher.url, {});
}
function getPublisherList(query) {
    return getList(apiConfig.publisher.url, query);
}

function getInstallationIntervals() {
    return getIntervals(apiConfig.installation.url, {});
}
function getInstallationList(query) {
    return getList(apiConfig.installation.url, query);
}

function getNetworkIntervals() {
    return getIntervals(apiConfig.network.url, {}, 1000);
}
function getNetworkList(query) {
    return getList(apiConfig.network.url, query);
}

function getNodeIntervals() {
    return getIntervals(apiConfig.node.url, {}, 1000);
}
function getNodeList(query) {
    return getList(apiConfig.node.url, query);
}

async function getIntervals(url, query, limit) {
    limit = limit || 10000;
    let options = {
        url: url + '?' + querystring.stringify(query),
        method: 'GET',
        fullResponse: true,
        json: true
    };
    let response = await request(options);
    if (response.statusCode !== 200) {
        throw response;
    }
    let ranges = _.range(0, response.body.count, limit);
    return ranges.map(function (e) {
        return {limit: limit, offset: e}
    });
}

async function getList(url, query) {
    let options = {
        url: url + '?' + querystring.stringify(query),
        method: 'GET',
        fullResponse: true,
        json: true
    };
    let response = await request(options);
    if (response.statusCode !== 200) {
        throw response;
    }
    return response.body;
}