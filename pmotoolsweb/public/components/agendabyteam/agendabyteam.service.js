// js/services/AgendabyteamService.js
(function() {
    'use strict';

    angular
        .module('AgendabyteamService', [])
        .factory('agendabyteamService', agendabyteamService);

        function agendabyteamService($http, $q) {

            return {
                getForTeam : function(id) {
                    return $http.get('/api/agenda/team/' + id);
                },
                getTotalByRecommendation : function(id) {
                    return $http.get('/api/agenda/team/total/' + id);
                },
                getAllInitiativesSumed : function() {
                    return $http.get('/api/agenda/initiative');
                },
                getAllSupports : function(id) {
                    return $http.get('/api/agenda/initiative/supports/' + id);
                },
                getRecommendedByTeam : function() {
                    return $http.get('/api/agenda/team/recommended');
                },
                getZeroCapacityTeam : function() {
                    return $http.get('/api/agenda/team/zerocapacity');
                },
                getZeroCostRecommendations : function() {
                    return $http.get('/api/agenda/initiative/zerocost');
                },
                getMasterInitiatives : function() {
                    return $http.get('/api/agenda/initiative/master');
                },
                getSupportingTeams : function(id) {
                    return $http.get('/api/agenda/team/supportrequested/' + id);
                }
            }
        };
})();

