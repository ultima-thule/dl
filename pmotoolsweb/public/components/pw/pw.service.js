// js/services/pw.service.js
(function() {
    'use strict';

    angular
        .module('PwService', [])
        .factory('pwService', pwService);

        function pwService($http) {
            return {
                generate : function(projectName, sprintNr) {
                    return $http.get('/api/createPw/' + projectName + '/sprint/' + sprintNr);
                },
                generateEstimate : function(projectName, dosubtasks) {
                    return $http.get('/api/createPwEstimate/' + projectName + '/' + str(dosubtasks));
                }
            }
        };

})();

