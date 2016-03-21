// js/services/AgendabyteamService.js
(function() {
    'use strict';

    angular
        .module('AgendabyteamService', [])
        .factory('agendabyteamService', agendabyteamService);

        function agendabyteamService($http) {
            return {
                getForTeam : function(id) {
                    return $http.get('/api/agendabyteam/' + id);
                },
                getTotalByRecommendation : function(id) {
                    return $http.get('/api/agendabyteamtotal/' + id);
                },
                getAllInitiativesSumed : function(id) {
                    return $http.get('/api/agendabyinitiative');
                },
                getAllSupports : function(id) {
                    return $http.get('/api/agendaallsupports/' + id);
                }
            }
        };
})();

