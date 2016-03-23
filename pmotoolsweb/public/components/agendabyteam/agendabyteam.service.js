// js/services/AgendabyteamService.js
(function() {
    'use strict';

    angular
        .module('AgendabyteamService', [])
        .factory('agendabyteamService', agendabyteamService);

        function agendabyteamService($http) {
            return {
                getForTeam : function(id) {
                    return $http.get('/api/agenda/team/' + id);
                },
                getTotalByRecommendation : function(id) {
                    return $http.get('/api/agenda/team/total/' + id);
                },
                getAllInitiativesSumed : function(id) {
                    return $http.get('/api/agenda/initiative');
                },
                getAllSupports : function(id) {
                    return $http.get('/api/agenda/initiative/supports/' + id);
                },
                getRecommendedByTeam : function(id) {
                    return $http.get('/api/agenda/team/recommended');
                },
                getZeroCapacityTeam : function(id) {
                    return $http.get('/api/agenda/team/zerocapacity');
                }
            }
        };
})();

