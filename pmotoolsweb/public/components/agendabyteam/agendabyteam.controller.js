// public/js/controllers/AgendabyteamCtrl.js

(function() {
    'use strict';

    angular
        .module('AgendabyteamCtrl', [])
        .controller('AgendabyteamController', AgendabyteamController)
        .controller('AgendaByTeamsDetailsController', AgendaByTeamsDetailsController);

        AgendabyteamController.$inject = ['$scope', '$filter', '$mdDialog', '$sanitize', 'agendabyteamService', 'teamService', 'VisDataSet'];
        AgendaByTeamsDetailsController.$inject = ['$scope', '$filter', '$resource', '$mdDialog', '$mdToast',
        'selectedItem', 'agendabyteamService'];

        function AgendabyteamController($scope, $filter, $mdDialog, $sanitize, agendabyteamService, teamService, VisDataSet) {

            $scope.masterInitiatives = {};
            $scope.supportingTeams = {};

            $scope.reinit = function ()
            {
                $scope.totalSize = 0;
                $scope.initiatives = [];
                $scope.totalByRecommendation = [];
                $scope.allSumed = {};
                $scope.recommendedInfo = 0;
                $scope.networkdata = {}
            }

            $scope.networkoptions = {
                groups: {
                    supportTeam: {
                        shape: 'box',
                        color: '#7986CB',
                        font: {color: 'white', size: 12}

//                        shape: 'icon',
//                        icon: {
//                            face: 'FontAwesome',
//                            size: 36,
//                            code: '\uf0c0',
//                            color: '#7986CB'
//                        }
                    },
                    mainTeam: {
                        shape: 'box',
                        color: '#1A237E',
                        font: {color: 'white', size: 12}
                    }
                },
                edges: {
                    color: '#9E9E9E'
                }
            };

            function formatTeamName (text, len){
                return text.replace(/ /g, "\n");
            }

            $scope.prepareGraph = function (teamName, supportsData)
            {
                agendabyteamService.getSupportingTeams($scope.selectedTeam.name)
                    .success(function(data) {
                        var nodes = VisDataSet([
                          {id: teamName, label: formatTeamName(teamName), value: 5, group: 'mainTeam', labelHighlightBold: false}
                        ]);
                        var edges = VisDataSet([]);

                        for (var i=0; i < supportsData.length; i++) {
                            var supportTitle = supportsData[i].title;
                            var masterTeamName = $scope.masterInitiatives[supportTitle] || "TEAM UNKNOWN";
                            var edgeKey = teamName + masterTeamName;
                            var nodeExisting = nodes.get(masterTeamName);

                            if (nodeExisting===null)
                            {
                                nodes.add ({id: masterTeamName, label: formatTeamName(masterTeamName), value: 1,
                                    group: 'supportTeam', title: supportTitle});
                                edges.add ({id: edgeKey, from: teamName, to: masterTeamName,
                                    width: 1, label: "1", arrows: 'from'});
                            }
                            else
                            {
                                var newEdgeValue = edges.get(edgeKey).width + 1;
                                var newTitle = nodeExisting.title + " | " + supportTitle;
                                nodes.update([{id: masterTeamName, title: newTitle}]);
                                edges.update ([{id: edgeKey, width: newEdgeValue}]);
                                edges.update ([{id: edgeKey, label: newEdgeValue}]);

                            }
                        }

                        for (var i = 0, len = data.length; i < len; i++) {
                            var supportingTeamName = data[i]._id;
                            var edgeKey = teamName + supportingTeamName;
                            var nodeExisting = nodes.get(supportingTeamName);

                            if (nodeExisting===null)
                            {
                                nodes.add ({id: supportingTeamName, label: formatTeamName(supportingTeamName), value: 1,
                                    group: 'supportTeam'});
                                edges.add ({id: edgeKey, from: teamName, to: supportingTeamName,
                                    width: 1, label: "1", arrows: {to: true}});
                            }
                            else
                            {
                                var newEdgeValue = edges.get(edgeKey).width + data[i].total;
                                edges.update ([{id: edgeKey, width: newEdgeValue}]);
                                edges.update ([{id: edgeKey, label: newEdgeValue}]);
                                edges.update ([{id: edgeKey, arrows: {from: true, to: true}}]);

                            }
                        }

                        $scope.networkdata = {
                          nodes: nodes,
                          edges: edges
                        };

                });
            }

            $scope.reinit();

            $scope.showDialog = showDialog;

            $scope.recommended = 'Grooming: IT Recommendation';
            $scope.noScope = 'Grooming: No scope';
            $scope.notRecommended = '';

            $scope.legendStyles = {
                'Grooming: IT Recommendation' : {style: 'color:limegreen', icon: 'check_box', text: 'recommended initiatives'},
                'Grooming: No scope' : {style: 'color:red', icon: 'error_outline', text: 'initiatives with no scope'},
                '' : {style: '', icon: 'highlight_off', text: 'not recommended initiatives'}
            }

            $scope.teams = teamService.query(function() {
            });

            agendabyteamService.getMasterInitiatives()
                .success(function(data) {
                    for (var i = 0, len = data.length; i < len; i++) {
                        $scope.masterInitiatives[data[i].title] = data[i].team_name;
                    }
                });

            $scope.loadInitiatives = function () {
                $scope.reinit();
                agendabyteamService.getForTeam($scope.selectedTeam.name)
                    .success(function(data) {
                        $scope.initiatives = data;

                        var supportsData = $filter('filter')(data, {type_name: 'Plan: support'})
                        $scope.prepareGraph ($scope.selectedTeam.name, supportsData)

                        agendabyteamService.getTotalByRecommendation($scope.selectedTeam.name)
                            .success(function(data2) {
                                for (var i = 0, len = data2.length; i < len; i++) {
                                    $scope.totalByRecommendation[data2[i]._id] = data2[i];
                                }
                                if ($scope.totalByRecommendation[$scope.recommended] !== undefined && $scope.selectedTeam.capacity !== 0)
                                {
                                    $scope.recommendedInfo = (Number($scope.totalByRecommendation[$scope.recommended].total) / Number($scope.selectedTeam.capacity) * 100) || 0;
                                }


                                agendabyteamService.getAllInitiativesSumed()
                                    .success(function(data3) {
                                        for (var i = 0, len = data3.length; i < len; i++) {
                                            $scope.allSumed[data3[i]._id] = data3[i];
                                        }
                                 });

                             });
                     });

            };

            function showDialog(data, dataTotalSize, event) {
                var tempData = undefined;
                if (data === undefined) {
                    tempData = {};
                } else {
                    tempData = {
                        _id: data._id,
                        title: data.title,
                        size: data.size,
                        totalSize: dataTotalSize,
                        description: data.description,
                        comments: data.comments
                    };
                }
                $mdDialog.show({
                    templateUrl: 'editor.html',
                    targetEvent: event,
                    locals: {
                        selectedItem: tempData
                    },
                    bindToController: true,
                    controller: AgendaByTeamsDetailsController,
                    parent: angular.element(document.body)
                })
                .then(
                    function (result) {
                    }
                );
            }

        };

        //Dialog's controller
        function AgendaByTeamsDetailsController ($scope, $filter, $resource, $mdDialog, $mdToast, selectedItem, agendabyteamService) {
            $scope.view = {
                selectedItem: selectedItem
            };
            $scope.allSupports = [];
            $scope.back = back;

            $scope.recommended = 'Grooming: IT Recommendation';
            $scope.noScope = 'Grooming: No scope';
            $scope.notRecommended = '';

            $scope.legendStyles = {
                'Grooming: IT Recommendation' : {style: 'color:limegreen', icon: 'check_box', text: 'recommended initiatives'},
                'Grooming: No scope' : {style: 'color:red', icon: 'error_outline', text: 'initiatives with no scope'},
                '' : {style: '', icon: 'highlight_off', text: 'not recommended initiatives'}
            }


            function back() {
                $mdDialog.cancel();
            }

            agendabyteamService.getAllSupports(selectedItem.title)
                .success(function(data) {
                    $scope.allSupports = data;
             });

        };

})();