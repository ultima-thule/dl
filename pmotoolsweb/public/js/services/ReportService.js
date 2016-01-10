// js/services/ReportService.js
angular.module('ReportService', [])

    // super simple service
    // each function returns a promise object
    .factory('Reports', function($http) {
        return {
            get : function() {
                return $http.get('/api/reports');
            },

            get : function(id) {
                return $http.get('/api/reports/id=' + id);
            }
        }
    });