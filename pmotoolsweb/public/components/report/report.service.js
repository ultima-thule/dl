// js/services/ReportService.js
(function() {
    'use strict';

    angular
        .module('ReportService', [])
        .factory('Reports', reports);

        function reports($http) {
            return {
                get : function() {
                    return $http.get('/api/reports');
                },
                getId : function(id) {
                    return $http.get('/api/reports/' + id,
                        { responseType: 'arraybuffer',
                         headers: {
                        'Content-type': 'application/json',
                        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                            }
                        });
                },
                generate : function() {
                    return $http.get('/api/genreport');
                }
            }
        };

})();

