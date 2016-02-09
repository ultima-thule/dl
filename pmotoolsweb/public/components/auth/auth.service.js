// js/services/ReportService.js
(function() {
    'use strict';

    angular
        .module('AuthService', [])
        .factory('authService', authService);

        function authService($http, $cookies) {
            return {
                getMe : function() {
                    return $http.get('/api/me/' + $cookies.get("pmo"));
                }
            }
        };

})();

