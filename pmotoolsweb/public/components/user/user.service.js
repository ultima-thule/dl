// js/services/UserService.js
(function() {
    'use strict';

    angular
        .module('UserService', [])
        .factory('userService', userService);

        function userService($resource) {
            return $resource('/api/users/:id', { id: '@_id' }, {
                update: {method: 'PUT'},
                query: {method: 'GET', isArray: true},
                get: {method: 'GET'},
            });
        };

})();
