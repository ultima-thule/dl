// js/services/AgendaService.js
(function() {
    'use strict';

    angular
        .module('AgendaService', [])
        .factory('agendaService', agendaService);

        function agendaService($http) {
            return {
                get : function() {
                    return $http.get('/api/reports/plan');
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
                    return $http.get('/api/genreportplan');
                },
                getAllRelations : function() {
                    return $http.get('/api/agenda/supportrequested');
                }
            }
        };

})();

