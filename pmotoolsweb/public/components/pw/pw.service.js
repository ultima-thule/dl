// js/services/pw.service.js
(function() {
    'use strict';

    angular
        .module('PwService', [])
        .factory('pwService', pwService);

        function pwService($http) {
            return {
                generate : function(projectName, sprintNr) {
                    return $http.get('/api/createPw/' + projectName + '/' + sprintNr);
                }
            }
        };

})();

