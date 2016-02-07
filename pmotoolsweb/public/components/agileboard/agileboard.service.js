// js/services/AgileboardService.js
(function() {
    'use strict';

    angular
        .module('AgileboardService', [])
        .factory('agileboardService', agileboardService);

        function agileboardService($http) {
            return {
                getAll : function() {
                    return $http.get('/api/jira/boards');
                },
                getBoard : function(id) {
                    return $http.get('/api/jira/boards/' + id);
                }
            }
        };

})();