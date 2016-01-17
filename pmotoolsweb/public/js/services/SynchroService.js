// js/services/SynchroService.js
angular.module('SynchroService', [])

    .factory('Synchro', function($resource) {
        return $resource('/api/synchro/:id', { id: '@_id' }, {
            update: {method: 'PUT'},
            query: {method: 'GET', isArray: true},
            get: {method: 'GET'},
        });
    });

