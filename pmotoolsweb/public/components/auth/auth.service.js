// js/services/ReportService.js
(function() {
    'use strict';

    angular
        .module('AuthService', [])
        .factory('authService', authService);

        function authService($http) {
            return {
                getMe : function(token) {
                    return $http.get('/api/me/' + token);
                }
            }
        };

})();

