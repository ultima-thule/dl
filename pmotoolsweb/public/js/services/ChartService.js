// js/services/ChartService.js
angular.module('ChartService', [])

    .factory('Chart', function($http) {
        return {
            getCardsBySponsorCnt : function() {
                return $http.get('/api/chart/cardbysponsor');
            },
            getCardsByWorkflowCnt : function() {
                return $http.get('/api/chart/cardbyworkflowstatus');
            }
        }
    });
