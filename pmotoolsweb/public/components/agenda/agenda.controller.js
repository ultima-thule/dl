// public/js/controllers/AgendaCtrl.js

(function() {
    'use strict';

    angular
        .module('AgendaCtrl', [])
        .controller('AgendaController', AgendaController)
        .controller('AgendaDetailsController', AgendaDetailsController);

        AgendaController.$inject = ['$scope', '$http', '$routeParams', '$location', '$mdDialog', 'agendaService', 'FileSaver', 'Blob',
            'namedParamService', 'agendabyteamService', 'VisDataSet'];
        AgendaDetailsController.$inject = ['$scope', '$mdDialog', '$mdToast', 'listType', 'listData', 'problemText'];

        function AgendaController($scope, $http, $routeParams, $location, $mdDialog, agendaService, FileSaver, Blob, namedParamService,
            agendabyteamService, VisDataSet) {

            $scope.title = "IT production reports";
            $scope.zeroTeams = [];
            $scope.zeroCost = [];
            $scope.teamOverrun = [];
            $scope.showDialog = showDialog;
            $scope.isRegenerating = false;

            $scope.hideOneRelations = false;

            $scope.networkoptions = {
                nodes: {
                    shape: 'dot',
                    scaling:{
                        label: {
                            min:8,
                            max:20
                        }
                    }
                }
            };

            function formatTeamName (text, len){
                return text.replace(/ /g, "\n");
            }

            $scope.prepareGraph = function (hideOnes)
            {
                agendaService.getAllRelations()
                    .success(function(data) {
                        var nodes = VisDataSet([]);
                        var edges = VisDataSet([]);

                        for (var i = 0, len = data.length; i < len; i++) {
                            var fromTeamName = data[i]._id.masterTeam;
                            var toTeamName = data[i]._id.supportTeam;

                            if (fromTeamName != toTeamName) {
                                var nodeFromExisting = nodes.get(fromTeamName);
                                if (nodeFromExisting===null) {
                                    nodes.add ({id: fromTeamName, label: formatTeamName(fromTeamName), value: 1});
                                }
                                else {
                                    nodes.update ([{id: fromTeamName, value: nodeFromExisting.value + 1}]);
                                }

                                var nodeToExisting = nodes.get(toTeamName);
                                if (nodeToExisting===null) {
                                    nodes.add ({id: toTeamName, label: formatTeamName(toTeamName), value: 1});
                                }
                                else {
                                    nodes.update ([{id: toTeamName, value: nodeToExisting.value + 1}]);
                                }

                                var edgeKey = fromTeamName + toTeamName;
                                var edgeExisting = edges.get(edgeKey);
                                var edgeWeight = data[i].total;
                                if (edgeExisting===null) {
                                    edges.add ({id: edgeKey, from: fromTeamName, to: toTeamName,
                                        value: edgeWeight, label: edgeWeight});
                                }
                                else {
                                    var newEdgeWeight = edgeExisting.value + edgeWeight;
                                    edges.update ([{id: edgeKey, value: newEdgeWeight}]);
                                    edges.update ([{id: edgeKey, label: newEdgeWeight}]);
                                }
                            }
                        }

                        $scope.networkdata = {
                          nodes: nodes,
                          edges: edges
                        };

                });
            }

            $scope.generateReport = function() {
                $scope.isLoading = true;
                agendaService.generate ()
                .success(function(data){
                    agendaService.get('/api/agendareports')
                                .success(function(data2) {
                                    $scope.reports = data2;
                                })
                                .error(function(data2) {
                                    console.log('Error: ' + data2);
                                })
                                .finally(function() {
                                    $scope.isLoading = false;
                                });
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                    $scope.isLoading = false;
                });
            }

            // if requested to download a file
            if ($routeParams.id)
            {
                agendaService.getId($routeParams.id)
                .success(function(data){
                    var blob = new Blob([data], {
                        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                        });

                    var date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
                    var filename = "report " + date + ".xlsx";
                    FileSaver.saveAs(blob, filename);
                    $location.path('/reports');
                }).error(function(data) {
                    console.log('Error: ' + data);
                });

            }
            //all reports lists
            else
            {
                // when landing on the page, get all reports and show them
                var data = namedParamService.getByKey('last_leankit_synchro')
                .success(function(data){
                    if (data.length > 0)
                        $scope.lastLeankitDate = data[0].param_value_date
                }).error(function(data) {
                    console.log('Error: ' + data);
                });

                //show progress bar
                $scope.isLoading = true;

                agendaService.get('/api/agendareports')
                    .success(function(data) {
                        $scope.reports = data;
                    })
                    .error(function(data) {
                        console.log('Error: ' + data);
                    })
                    .finally(function() {
                        $scope.isLoading = false;
                    });

                agendabyteamService.getZeroCapacityTeam()
                    .success(function(data) {
                        $scope.zeroTeams = data;
                    });

                agendabyteamService.getZeroCostRecommendations()
                    .success(function(data) {
                        $scope.zeroCost = data;
                    });

                agendabyteamService.getRecommendedByTeam()
                    .success(function(data) {
                        for (var i = 0, len = data.length; i < len; i++) {
                            if (data[i].teamagg[0]!== undefined && data[i].teamagg[0].capacity!== undefined
                                && data[i].teamagg[0].capacity > 0 && data[i].total > data[i].teamagg[0].capacity)
                            {
                                $scope.teamOverrun.push (data[i]);
                            }
                        }
                    });

                $scope.prepareGraph();
            }

            function showDialog(listType, listData, problemText, event) {
                $mdDialog.show({
                    templateUrl: 'editor.html',
                    targetEvent: event,
                    locals: {
                        listData: listData,
                        problemText: problemText,
                        listType: listType
                    },
                    bindToController: true,
                    controller: AgendaDetailsController,
                    parent: angular.element(document.body)
                })
                .then(
                    function (result) {
                    }
                );
            }

        };

        //Dialog's controller
        function AgendaDetailsController ($scope, $mdDialog, $mdToast, listType, listData, problemText) {
            $scope.view = {
                listData: listData,
                problemText: problemText,
                listType: listType
            };
            $scope.back = back;

            function back() {
                $mdDialog.cancel();
            }

        };

})();