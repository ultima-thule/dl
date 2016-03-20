// public/js/controllers/AgendabyteamCtrl.js

(function() {
    'use strict';

    angular
        .module('AgendabyteamCtrl', [])
        .controller('AgendabyteamController', AgendabyteamController);

        AgendabyteamController.$inject = ['$scope', 'agendabyteamService', 'teamService'];

        function AgendabyteamController($scope, agendabyteamService, teamService) {

            $scope.teams = teamService.query(function() {
            });

            $scope.loadInitiatives = function () {
                console.log($scope.selectedTeam.name);
                $scope.initiatives = agendabyteamService.getForTeam($scope.selectedTeam.name)
                    .success(function(data) {
                        $scope.initiatives = data;
                     });
            };

        };

})();