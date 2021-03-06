'use strict';

var angular = require('angular');

(function () {
    'use strict';

    angular
        .module('portal')
        .factory('Cms', function ($resource, env) {
            return $resource(env.cmsProxy + 'node/:id', null, {
                    'query': {
                        method: 'GET',
                        isArray: false
                    }
                }
            );
        })
        .factory('CmsSearch', function ($resource) {
            return $resource('/api/cms/search', null, {
                    'query': {
                        method: 'GET',
                        isArray: false
                    }
                }
            );
        })
        .factory('CmsNode', function ($resource, env) {
            return $resource(env.cmsProxy + 'v1/:type/:id', null, {
                'get': {
                    method: 'GET',
                    isArray: false,
                    params: {
                        type: '@nodeType',
                        id: '@nodeId'
                    }
                }
            });
        })
        // Accepting gbifRegion as param
        // return number of publishers in the region
        .factory('LiteratureCount', function ($resource) {
            return $resource('/api/literature/count',
                {gbifRegion: 'GLOBAL'},
                {
                    'get': {
                        method: 'GET',
                        params: {gbifRegion: '@gbifRegion'},
                        isArray: false
                    }
                })
                ;
        })
        .factory('LiteratureYearly', function ($resource) {
            return $resource('/api/literature-yearly/count',
                {gbifRegion: 'GLOBAL'},
                {
                    'get': {
                        method: 'GET',
                        params: {gbifRegion: '@gbifRegion'},
                        isArray: true
                    }
                })
                ;
        })
        ;
})();

