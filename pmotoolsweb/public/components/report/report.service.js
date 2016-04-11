// js/services/ReportService.js
(function() {
    'use strict';

    angular
        .module('ReportService', [])
        .factory('reportService', reportService);

        function reportService($http) {
            return {
                get : function(id) {
                    return $http.get('/api/reports/format' + id);
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
                generate : function(format_nr) {
                    return $http.get('/api/genreport/' + format_nr);
                }
            }
        };

})();

