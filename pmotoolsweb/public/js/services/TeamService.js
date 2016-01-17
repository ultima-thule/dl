// js/services/TeamService.js
angular.module('TeamService', [])

    .factory('Teams', function($resource) {
        return $resource('/api/teams/:id', { id: '@_id' }, {
            update: {method: 'PUT'},
            query: {method: 'GET', isArray: true},
            get: {method: 'GET'},
        });
    });

