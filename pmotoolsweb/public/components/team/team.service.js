// js/services/TeamService.js
(function() {
    'use strict';

    angular
        .module('TeamService', [])
        .factory('Teams', teams);

        function teams($resource) {
            return $resource('/api/teams/:id', { id: '@_id' }, {
                update: {method: 'PUT'},
                query: {method: 'GET', isArray: true},
                get: {method: 'GET'},
            });
        };

})();
