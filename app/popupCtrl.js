'use strict';


angular.module('app').controller('popupCtrl', function ($scope, $http) {
    $scope.searchResult = [];
    $scope.searchResult.total = 0;
    $scope.searchResult.hits = [];
    $scope.searchText = '';
    $scope.isTanach = true;
    $scope.isTalmud = false;
    $scope.isMishna = false;
    $scope.isOthers = false;


    $scope.init = function () {
         
            $scope.searchText = textFromUserSelection;
         
    }

    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

    $scope.getFilter = function () {
        var searchFilter = [];

        if ($scope.isTanach) {
            searchFilter.push({
                "regexp": {
                    "path": "Tanakh/.*"
                }
            });
        }

        if ($scope.isMishna) {
            searchFilter.push({
                "regexp": {
                    "path": "Mishnah/.*"
                }
            });
        }

        if ($scope.isTalmud) {
            searchFilter.push({
                "regexp": {
                    "path": "Talmud/.*"
                }
            });
        }

        if ($scope.isOthers) {
            searchFilter.push({
                "regexp": { "path": "Tanakh Commentaries/.*" },
                "regexp": { "path": "Mishnah Commentaries/.*" },
                "regexp": { "path": "Talmud Commentaries/.*" },
                "regexp": { "path": "Midrash/.*" },
                "regexp": { "path": "Midrash Commentaries/.*" },
                "regexp": { "path": "Halakhah/.*" },
                "regexp": { "path": "Kabbalah/.*" },
                "regexp": { "path": "Liturgy/.*" },
                "regexp": { "path": "Philosophy/.*" },
                "regexp": { "path": "Tanaitic/.*" },
                "regexp": { "path": "Chasidut/.*" },
                "regexp": { "path": "Responsa/.*" }
            });
        }

        return searchFilter;
    }

    $scope.search = function () {
        console.log('search started: ' + $scope.searchText);
        console.log(3);
        console.log(textFromUserSelection);
        console.log(4);

        var searchFilter = $scope.getFilter();

        $http({
            url: 'https://search.sefaria.org/sefaria/_search',
            method: "POST",
            data: {
                "from": 0, // document offset
                "size": 10, //number of documents to return
                "highlight": {
                    "pre_tags": [ // tags to wrap terms that were found
                        "<b>"
                    ],
                    "post_tags": [
                        "</b>"
                    ],
                    "fields": { // size of the text returned, in characters
                        "exact": {
                            "fragment_size": 200
                        }
                    }
                },
                "sort": [ // fields of the document to use when sorting results. sorts are applied sequentially.
                    {
                        "comp_date": {}
                    },
                    {
                        "order": {}
                    }
                ],
                "query": {
                    "filtered": {
                        "query": {
                            "match_phrase": {
                                "exact": {
                                    "query": $scope.searchText
                                }
                            }
                        },
                        "filter": {
                            "bool": {
                                "must": [{
                                    "or": searchFilter
                                }, {
                                    "type": {
                                        "value": "text"
                                    }
                                }]
                            }
                        }
                    }
                }
            }
        }).then(function (response) {
            $scope.searchResult = response.data.hits;
            console.dir($scope.searchResult);
        },
            function (response) {
                // failed
                console.log(errorRes);
            });

        // clear result array
        //$scope.searchResult.splice(0, $scope.searchResult.length);
    }

    $scope.copyLinkToClipboard = function (item) {
        pasteToActiveWhatever("https://www.sefaria.org/" + item._source.ref + "?lang=he");
    }

    $scope.copyTextToClipboard = function (item) {
        pasteToActiveWhatever(item._source.exact);

    }

});
