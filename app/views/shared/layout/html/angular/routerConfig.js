"use strict";
var angular = require('angular');

require('angular-ui-router');

angular
    .module('portal')
    .config(routerConfig);

// The annotation is necessary to work with minification and ngAnnotate when using as a commonjs Module - http://chrisdoingweb.com/blog/minifying-browserified-angular-modules/
/** @ngInject */
function routerConfig($stateProvider, $locationProvider, BUILD_VERSION) {
    //TODO We need a way to handle routes when refreshing. Server needs to know about these routes.
    $stateProvider
        .state('localization', { // http://stackoverflow.com/questions/32357615/option-url-path-ui-router
            url: '/{locale:(?:en|da|es)}',
            abstract: true,
            template: '<div ui-view="main" class="viewContentWrapper"></div>',
            params: {locale: {squash: true, value: 'en'}}
        })
        .state('omniSearch', {
            parent: 'localization',
            url: '/search?q',
            views: {
                main: {
                    templateUrl: '/templates/pages/search/search.html?v=' + BUILD_VERSION,
                    controller: 'searchCtrl',
                    controllerAs: 'rootSearch'
                }
            }
        })
        .state('occurrenceSearch', {
            parent: 'localization',
            url: '/occurrence?q&basis_of_record&catalog_number&collection_code&continent&country&dataset_key&decimal_latitude&decimal_longitude&depth&elevation&event_date&has_coordinate&has_geospatial_issue&institution_code&issue&last_interpreted&media_type&month&occurrence_id&publishing_country&publishing_org&recorded_by&record_number&scientific_name&taxon_key&kingdom_key&phylum_key&class_key&order_key&family_key&genus_key&sub_genus_key&species_key&year&establishment_means&type_status&organism_id&locality&water_body&state_province&protocol&license&repatriated&{advanced:bool}&geometry',
            params: {
                advanced: {
                    value: false,
                    squash: true
                },
                repatriated: {
                    type: 'string',
                    value: undefined,
                    squash: true,
                    array: false
                }
            },
            views: {
                main: {
                    templateUrl: '/templates/pages/occurrence/occurrence.html?v=' + BUILD_VERSION,
                    controller: 'occurrenceCtrl',
                    controllerAs: 'occurrence'
                }
            }
        })
        .state('occurrenceSearchTable', {
            parent: 'occurrenceSearch',
            url: '/search?offset&limit',
            templateUrl: '/templates/pages/occurrence/table/occurrenceTable.html?v=' + BUILD_VERSION,
            controller: 'occurrenceTableCtrl',
            controllerAs: 'occTable'
        })
        .state('occurrenceSearchMap', {
            parent: 'occurrenceSearch',
            url: '/map?center&zoom',
            templateUrl: '/templates/pages/occurrence/map/occurrenceMap.html?v=' + BUILD_VERSION,
            controller: 'occurrenceMapCtrl',
            controllerAs: 'occMap'
        })
        .state('occurrenceSearchGallery', {
            parent: 'occurrenceSearch',
            url: '/gallery',
            templateUrl: '/templates/pages/occurrence/gallery/occurrenceGallery.html?v=' + BUILD_VERSION,
            controller: 'occurrenceGalleryCtrl',
            controllerAs: 'occGallery'
        })
        .state('occurrenceSearchSpecies', {
            parent: 'occurrenceSearch',
            url: '/species',
            templateUrl: '/templates/pages/occurrence/species/occurrenceSpecies.html?v=' + BUILD_VERSION,
            controller: 'occurrenceSpeciesCtrl',
            controllerAs: 'occSpecies'
        })
        .state('occurrenceSearchDatasets', {
            parent: 'occurrenceSearch',
            url: '/datasets',
            templateUrl: '/templates/pages/occurrence/datasets/occurrenceDatasets.html?v=' + BUILD_VERSION,
            controller: 'occurrenceDatasetsCtrl',
            controllerAs: 'occDatasets'
        })
        .state('occurrenceSearchDownload', {
            parent: 'occurrenceSearch',
            url: '/download',
            templateUrl: '/templates/pages/occurrence/download/occurrenceDownload.html?v=' + BUILD_VERSION,
            controller: 'occurrenceDownloadCtrl',
            controllerAs: 'occDownload'
        })
        .state('datasetSearch', {
            parent: 'localization',
            url: '/dataset?offset&limit&q&type&keyword&publishing_org&hosting_org&publishing_country&decade&taxon_key&project_id',
            views: {
                main: {
                    templateUrl: '/templates/pages/dataset/search/dataset.html?v=' + BUILD_VERSION,
                    controller: 'datasetCtrl',
                    controllerAs: 'dataset'
                }
            }
        })
        .state('datasetSearchTable', {
            parent: 'datasetSearch',
            url: '/search',
            templateUrl: '/templates/pages/dataset/search/table/datasetTable.html?v=' + BUILD_VERSION,
            controller: 'datasetTableCtrl',
            controllerAs: 'datasetTable'
        })
        .state('datasetKey', {
            parent: 'localization',
            url: '/dataset/:key',
            views: {
                main: {
                    templateUrl: '/api/template/dataset/key.html?v=' + BUILD_VERSION,
                    controller: 'datasetKeyCtrl',
                    controllerAs: 'datasetKey'
                }
            }
        })
        //.state('datasetKeyTaxonomy', {
        //    parent: 'datasetKey',
        //    url: '/taxonomy',
        //    templateUrl: '/api/template/dataset/taxonomy.html?v=' + BUILD_VERSION,
        //    controller: 'datasetTaxonomyCtrl',
        //    controllerAs: 'datasetTaxonomy'
        //})
        .state('datasetKeyActivity', {
            parent: 'datasetKey',
            url: '/activity?offset&limit',
            templateUrl: '/api/template/dataset/activity.html?v=' + BUILD_VERSION,
            controller: 'datasetActivityCtrl',
            controllerAs: 'datasetActivity'
        })
        .state('datasetKeyProject', {
            parent: 'datasetKey',
            url: '/project',
            templateUrl: '/api/template/dataset/project.html?v=' + BUILD_VERSION,
            controller: 'datasetProjectCtrl',
            controllerAs: 'datasetProject'
        })
        .state('datasetKeyStats', {
            parent: 'datasetKey',
            url: '/stats',
            templateUrl: '/api/template/dataset/stats.html?v=' + BUILD_VERSION,
            controller: 'datasetStatsCtrl',
            controllerAs: 'datasetStats'
        })
        .state('datasetKeyConstituents', {
            parent: 'datasetKey',
            url: '/constituents?offset',
            templateUrl: '/api/template/dataset/constituents.html?v=' + BUILD_VERSION,
            controller: 'datasetConstituentsCtrl',
            controllerAs: 'datasetConstituents'
        })
        .state('speciesSearch', {
            parent: 'localization',
            url: '/species?offset&limit&q&rank&dataset_key&constituent_key&highertaxon_key&name_type&status&issue&{advanced:bool}',
            params: {
                advanced: {
                    value: false,
                    squash: true
                }
            },
            views: {
                main: {
                    templateUrl: '/templates/pages/species/search/species.html?v=' + BUILD_VERSION,
                    controller: 'speciesCtrl',
                    controllerAs: 'species'
                }
            }
        })
        .state('speciesSearchList', {
            parent: 'speciesSearch',
            url: '/search',
            templateUrl: '/templates/pages/species/search/list/speciesList.html?v=' + BUILD_VERSION,
            controller: 'speciesListCtrl',
            controllerAs: 'speciesList'
        })
        .state('speciesSearchTable', {
            parent: 'speciesSearch',
            url: '/table',
            templateUrl: '/templates/pages/species/search/table/speciesTable.html?v=' + BUILD_VERSION,
            controller: 'speciesTableCtrl',
            controllerAs: 'speciesTable'
        })
        .state('speciesKey', {
            parent: 'localization',
            url: '/species/:speciesKey?refOffset&occurrenceDatasetOffset&checklistDatasetOffset',
            params: {
                advanced: {
                    value: false,
                    squash: true
                }
            },
            views: {
                main: {
                    templateUrl: '/api/template/species/key.html?v=' + BUILD_VERSION,
                    controller: 'speciesKey2Ctrl',
                    controllerAs: 'speciesKey2'
                }
            }
        })
        .state('speciesKeyVerbatim', {
            parent: 'speciesKey',
            url: '/verbatim',
            params: {
                advanced: {
                    value: false,
                    squash: true
                }
            },
            views: {
                main: {
                    templateUrl: '/api/template/species/key.html?v=' + BUILD_VERSION,
                    controller: 'speciesKey2Ctrl',
                    controllerAs: 'speciesKey2'
                }
            }
        })
        .state('publisherSearch', {
            parent: 'localization',
            url: '/publisher?offset&limit&q&country',
            views: {
                main: {
                    templateUrl: '/templates/pages/publisher/search/publisher.html?v=' + BUILD_VERSION,
                    controller: 'publisherCtrl',
                    controllerAs: 'publisher'
                }
            }
        })
        .state('publisherSearchList', {
            parent: 'publisherSearch',
            url: '/search',
            templateUrl: '/templates/pages/publisher/search/list/publisherList.html?v=' + BUILD_VERSION,
            controller: 'publisherListCtrl',
            controllerAs: 'publisherList'
        })
        .state('publisherKey', {
            parent: 'localization',
            url: '/publisher/:key',
            views: {
                main: {
                    templateUrl: '/api/template/publisher/key.html?v=' + BUILD_VERSION,
                    controller: 'publisherKeyCtrl',
                    controllerAs: 'publisherKey'
                }
            }
        })
        .state('resourceSearch', {
            parent: 'localization',
            url: '/resource?offset&limit&q&contentType&year&literatureType&language&audiences&purposes&topics&countriesOfResearcher&countriesOfCoverage&_showPastEvents&gbifDatasetKey&publishingOrganizationKey&gbifDownloadKey',
            views: {
                main: {
                    templateUrl: '/templates/pages/resource/search/resource.html?v=' + BUILD_VERSION,
                    controller: 'resourceCtrl',
                    controllerAs: 'resource'
                }
            }
        })
        .state('resourceSearchList', {
            parent: 'resourceSearch',
            url: '/search',
            templateUrl: '/templates/pages/resource/search/list/resourceList.html?v=' + BUILD_VERSION,
            controller: 'resourceListCtrl',
            controllerAs: 'resourceList'
        })
        .state('contactUs', {
            parent: 'localization',
            url: '/contact-us2',
            views: {
                main: {
                    templateUrl: '/api/template/contactUs/contactUs.html?v=' + BUILD_VERSION,
                    controller: 'contactUsCtrl',
                    controllerAs: 'contactUs'
                }
            }
        })
        .state('contactDirectory', {
            parent: 'contactUs',
            url: '/directory',
            templateUrl: '/api/template/contactUs/directory.html?v=' + BUILD_VERSION,
            controller: 'contactDirectoryCtrl',
            controllerAs: 'contactDirectory'
        })
        .state('user', {
            parent: 'localization',
            url: '/user',
            views: {
                main: {
                    templateUrl: '/templates/pages/user/user.html?v=' + BUILD_VERSION,
                    controller: 'userCtrl',
                    controllerAs: 'user'
                }
            }
        })
        .state('userProfile', {
            parent: 'user',
            url: '/profile',
            templateUrl: '/templates/pages/user/profile/userProfile.html?v=' + BUILD_VERSION,
            controller: 'userProfileCtrl',
            controllerAs: 'userProfile'
        })
        .state('userDownloads', {
            parent: 'user',
            url: '/download?offset&limit',
            templateUrl: '/templates/pages/user/downloads/userDownloads.html?v=' + BUILD_VERSION,
            controller: 'userDownloadsCtrl',
            controllerAs: 'userDownloads'
        })
        .state('userSettings', {
            parent: 'user',
            url: '/settings',
            templateUrl: '/templates/pages/user/settings/userSettings.html?v=' + BUILD_VERSION,
            controller: 'userSettingsCtrl',
            controllerAs: 'userSettings'
        })
        .state('node', {
            parent: 'localization',
            url: '/node/:key?offset_datasets&offset_endorsed',
            views: {
                main: {
                    templateUrl: '/api/template/node/key.html?v=' + BUILD_VERSION,
                    controller: 'nodeKeyCtrl',
                    controllerAs: 'nodeKey'
                }
            }
        })
        .state('participant', {
            parent: 'localization',
            url: '/participant/:key?offset_datasets&offset_endorsed',
            views: {
                main: {
                    templateUrl: '/api/template/participant/key.html?v=' + BUILD_VERSION,
                    controller: 'participantKeyCtrl',
                    controllerAs: 'participantKey'
                }
            }
        })
        .state('installation', {
            parent: 'localization',
            url: '/installation/:key?offset',
            views: {
                main: {
                    templateUrl: '/templates/pages/installation/key/installationKey.html?v=' + BUILD_VERSION,
                    controller: 'installationKeyCtrl',
                    controllerAs: 'installationKey'
                }
            }
        })
        .state('network', {
            parent: 'localization',
            url: '/network/:key?offset',
            views: {
                main: {
                    templateUrl: '/templates/pages/network/key/networkKey.html?v=' + BUILD_VERSION,
                    controller: 'networkKeyCtrl',
                    controllerAs: 'networkKey'
                }
            }
        })
        .state('country', {
            parent: 'localization',
            url: '/country/:key',
            views: {
                main: {
                    templateUrl: '/api/template/country.html?v=' + BUILD_VERSION,
                    controller: 'countryKeyCtrl',
                    controllerAs: 'countryKey'
                }
            }
        })
        .state('countrySummary', {
            parent: 'country',
            url: '/summary',
            templateUrl: '/api/template/country/summary.html?v=' + BUILD_VERSION,
            controller: 'countrySummaryCtrl',
            controllerAs: 'countrySummary'
        })
        .state('countryAbout', {
            parent: 'country',
            url: '/about',
            templateUrl: '/api/template/country/about.html?v=' + BUILD_VERSION,
            controller: 'countryAboutCtrl',
            controllerAs: 'countryAbout'
        })
        .state('countryPublishing', {
            parent: 'country',
            url: '/publishing',
            templateUrl: '/api/template/country/publishing.html?v=' + BUILD_VERSION,
            controller: 'countryPublishingCtrl',
            controllerAs: 'countryPublishing'
        })
        .state('countryParticipation', {
            parent: 'country',
            url: '/participation',
            templateUrl: '/api/template/country/participation.html?v=' + BUILD_VERSION,
            controller: 'countryParticipationCtrl',
            controllerAs: 'countryParticipation'
        })
        .state('countryTrends', {
           parent: 'country',
           url: '/trends/{direction:(?:about|published)}',
           params: {direction: {squash: true, value: 'about'}},
           templateUrl: '/templates/pages/participant/country/trends.html?v=' + BUILD_VERSION,
           controller: 'countryActivityCtrl',
           controllerAs: 'countryActivity'
        })
        .state('countryActivity', {
           parent: 'country',
           url: '/activity/{direction:(?:about|published)}',
           params: {direction: {squash: true, value: 'about'}},
           templateUrl: '/templates/pages/participant/country/activity.html?v=' + BUILD_VERSION,
           controller: 'countryActivityCtrl',
           controllerAs: 'countryActivity'
        })
        .state('theGbifNetwork', {

            url: '/the-gbif-network/:region?',
            params: {region: {squash: true, value: 'global'}},
            templateUrl: '/templates/pages/theGbifNetwork/theGbifNetwork.html?v=' + BUILD_VERSION,
            controller: 'theGbifNetworkCtrl',
            controllerAs: 'vm'
        })


        //theGbifNetworkCtrl

        //.state('countryParticipant', {
        //    parent: 'country',
        //    url: '/participant?offset_datasets&offset_endorsed',
        //    templateUrl: '/templates/pages/country/key/participant/countryParticipant.html?v=' + BUILD_VERSION,
        //    controller: 'countryParticipantCtrl',
        //    controllerAs: 'countryParticipant'
        //})
        //.state('programmeProjects', {
        //    parent: 'localization',
        //    url: '/programme2/:key/projects/:title',
        //    views: {
        //        main: {
        //            templateUrl: '/templates/pages/resource/key/programme/projects/projects.html',
        //            controller: 'programmeProjectsCtrl',
        //            controllerAs: 'programmeProjects'
        //        }
        //    }
        //})
        //.state('programmeNews', {
        //    parent: 'localization',
        //    url: '/programme2/:key/news/:title',
        //    views: {
        //        main: {
        //            templateUrl: '/templates/pages/resource/key/programme/news/news.html',
        //            controller: 'programmeNewsCtrl',
        //            controllerAs: 'programmeNews'
        //        }
        //    }
        //})
        //.state('programmeEvents', {
        //    parent: 'localization',
        //    url: '/programme2/:key/events/:title',
        //    views: {
        //        main: {
        //            templateUrl: '/templates/pages/resource/key/programme/events/events.html',
        //            controller: 'programmeEventsCtrl',
        //            controllerAs: 'programmeEvents'
        //        }
        //    }
        //})

    ;

    //if unknown route then go to server instead of redirecting to home: $urlRouterProvider.otherwise('/');

    //We do not support ie9 and browsers without history api https://docs.angularjs.org/error/$location/nobase
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false,
        rewriteLinks: false
    });
}

module.exports = routerConfig;

