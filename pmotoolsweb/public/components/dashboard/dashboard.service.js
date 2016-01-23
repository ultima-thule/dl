// js/services/ChartService.js
angular.module('DashboardService', [])

    .factory('Dashboard', function($http) {
        return {
            getCardsBySponsorCnt : function() {
                return $http.get('/api/dashboard/cardbysponsor');
            },
            getCardsByWorkflowCnt : function() {
                return $http.get('/api/dashboard/cardbyworkflowstatus');
            }
        }
    });
