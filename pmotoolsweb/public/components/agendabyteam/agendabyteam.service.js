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
                }
            }
        };
})();

