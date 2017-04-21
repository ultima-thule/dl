// js/services/pw.service.js
(function() {
    'use strict';

    angular
        .module('PwService', [])
        .factory('pwService', pwService);

        function pwService($http) {
            return {
                generate : function(projectName, sprintNr) {
                    return $http.get('/api/createpw/' + projectName + '/sprint/' + sprintNr);
                },
                generateDesc : function(projectName, sprintNr) {
                    return $http.get('/api/createpwdesc/' + projectName + '/sprint/' + sprintNr);
                },
                generateEstimate : function(projectName, dosubtasks) {
                    return $http.get('/api/createpw/' + projectName);
                }
            }
        };

})();

