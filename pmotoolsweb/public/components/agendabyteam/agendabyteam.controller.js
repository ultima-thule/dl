// public/js/controllers/AgendabyteamCtrl.js

(function() {
    'use strict';

    angular
        .module('AgendabyteamCtrl', [])
        .controller('AgendabyteamController', AgendabyteamController)
        .controller('AgendaByTeamsDetailsController', AgendaByTeamsDetailsController);

        AgendabyteamController.$inject = ['$scope', '$mdDialog', '$sanitize', 'agendabyteamService', 'teamService'];
        AgendaByTeamsDetailsController.$inject = ['$scope', '$filter', '$resource', '$mdDialog', '$mdToast',
        'selectedItem', 'agendabyteamService'];

        function AgendabyteamController($scope, $mdDialog, $sanitize, agendabyteamService, teamService) {

            $scope.totalSize = 0;
            $scope.initiatives = [];
            $scope.totalByRecommendation = [];
            $scope.allSumed = {};

            $scope.showDialog = showDialog;

            $scope.recommKey = 'Grooming: IT Recommendation';
            $scope.noRecommKey = 'Grooming: No scope';
            $scope.emptyKey = '';

            $scope.legendStyles = {
                'Grooming: IT Recommendation' : {style: 'color:limegreen', icon: 'check_box', text: 'recommended initiatives'},
                'Grooming: No scope' : {style: 'color:red', icon: 'error_outline', text: 'initiatives with no scope'},
                '' : {style: '', icon: 'highlight_off', text: 'not recommended initiatives'}
            }

            $scope.teams = teamService.query(function() {
            });

            $scope.loadInitiatives = function () {
                agendabyteamService.getForTeam($scope.selectedTeam.name)
                    .success(function(data) {
                        $scope.initiatives = data;

                        agendabyteamService.getTotalByRecommendation($scope.selectedTeam.name)
                            .success(function(data2) {
                                $scope.totalByRecommendation = data2;

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
                        description: data.description
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

            $scope.recommKey = 'Grooming: IT Recommendation';
            $scope.noRecommKey = 'Grooming: No scope';
            $scope.emptyKey = '';

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