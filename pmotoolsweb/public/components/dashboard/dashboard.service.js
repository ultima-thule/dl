// js/services/ChartService.js
(function() {
    'use strict';

    angular
        .module('DashboardService', [])
        .factory('Dashboard', dashboards);

        function dashboards($http) {
            return {
                getCardsBySponsorCnt : function() {
                    return $http.get('/api/dashboard/cardbysponsor');
                },
                getCardsByWorkflowCnt : function() {
                    return $http.get('/api/dashboard/cardbyworkflowstatus');
                }
            }
        };

})();
