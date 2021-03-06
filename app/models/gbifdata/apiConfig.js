'use strict';

var baseConfig = require('../../../config/config'),
    clientTileApi = baseConfig.tileApi,
    baseUrl = baseConfig.serverProtocol + baseConfig.dataApi,
    identityBaseUrl = baseConfig.serverProtocol + baseConfig.identityApi;

// TODO Establish URL concatenation policy. Always no trailing slash?
var apiConfig = {
    base: {
        url: baseUrl
    },
    search: {
        url: baseUrl + 'search/'
    },
    country: {
        url: baseUrl + 'node/country/'
    },
    dataset: {
        url: baseUrl + 'dataset/'
    },
    datasetSearch: {
        url: baseUrl + 'dataset/search/'
    },
    image: {
        url: baseConfig.dataApi + 'image/unsafe/'
    },
    installation: {
        url: baseUrl + 'installation/'
    },
    network: {
        url: baseUrl + 'network/'
    },
    node: {
        url: baseUrl + 'node/'
    },
    occurrence: {
        url: baseUrl + 'occurrence/'
    },
    occurrenceSearch: {
        url: baseUrl + 'occurrence/search/'
    },
    occurrenceTerm: {
        url: baseUrl + 'occurrence/term/'
    },
    occurrenceInterpretation: {
        url: baseUrl + 'enumeration/interpretationRemark/'
    },
    occurrenceDownloadDataset: {
        url: baseUrl + 'occurrence/download/dataset/'
    },
    occurrenceDownload: {
        url: baseUrl + 'occurrence/download/'
    },
    occurrenceDownloadUser: {
        url: baseUrl + 'occurrence/download/user/'
    },
    occurrenceSearchDownload: {
        url: baseUrl + 'occurrence/search/download/'
    },
    occurrenceCancelDownload: {
        url: baseUrl + 'occurrence/download/request/'
    },
    publisher: {
        url: baseUrl + 'organization/'
    },
    // publisherCreate: {
    //     url: baseUrl + 'organization/',
    //     canonical: 'organization/'
    // },
    publisherCreate: {
        url: "http://10.62.193.6:8080/" + 'organization/',
        canonical: 'organization/'
    },

    taxon: {
        url: baseUrl + 'species/'
    },
    taxonRoot: {
        url: baseUrl + 'species/root/'
    },
    taxonSearch: {
        url: baseUrl + 'species/search/'
    },
    taxonMatch: {
        url: baseUrl + 'species/match'
    },
    directoryParticipants: {
        url: baseUrl + 'directory/participant?limit=300'
    },
    directoryParticipant: {
        url: baseUrl + 'directory/participant/'
    },
    directoryNode: {
        url: baseUrl + 'directory/node/'
    },
    directoryPerson: {
        url: baseUrl + 'directory/person/'
    },
    directoryNodePerson: {
        url: baseUrl + 'directory/node_person/'
    },
    directoryParticipantPerson: {
        url: baseUrl + 'directory/participant_person/'
    },
    directoryPersonRole: {
        url: baseUrl + 'directory/person_role?limit=100'
    },
    directoryCommittee: {
        url: baseUrl + 'directory/committee'
    },
    directoryReport: {
        url: baseUrl + 'directory/report'
    },
    countryEnumeration: {
        url: baseUrl + 'enumeration/country'
    },
    user: {
        url: identityBaseUrl + 'user',
        canonical: 'user'
    },
    userCreate: {
        url: identityBaseUrl + 'admin/user/',
        canonical: 'admin/user/'
    },
    userAdmin: {
        url: identityBaseUrl + 'admin/user/',
        canonical: 'admin/user/'
    },
    userConfirm: {
        url: identityBaseUrl + 'admin/user/confirm',
        canonical: 'admin/user/confirm'
    },
    userLogin: {
        url: identityBaseUrl + 'user/login'
    },
    userLogout: {
        url: identityBaseUrl + 'user/logout'
    },
    userResetPassword: {
        url: identityBaseUrl + 'admin/user/resetPassword',
        canonical: 'admin/user/resetPassword'
    },
    userUpdateForgottenPassword: {
        url: identityBaseUrl + 'admin/user/updatePassword',
        canonical: 'admin/user/updatePassword'
    },
    userChallengeCodeValid: {
        url: identityBaseUrl + 'admin/user/confirmationKeyValid',
        canonical: 'admin/user/confirmationKeyValid'
    },
    userChangePassword: {
        url: identityBaseUrl + 'user/changePassword',
        canonical: 'user/changePassword'
    },
    clientTileApi: {
        url: clientTileApi
    },
    cookieNames: {
        userSession: 'USER_SESSION'
    },
    citesName: {
        url: 'https://api.speciesplus.net/api/v1/taxon_concepts.json'
    },
    dwcextensions: {
        url: 'http://gbrds.gbif.org/registry/extensions.json'
    }
};

module.exports = Object.freeze(apiConfig);
