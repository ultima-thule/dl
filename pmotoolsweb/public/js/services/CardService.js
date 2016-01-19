// js/services/CardeService.js
angular.module('CardService', [])
    .factory('Cards', function($resource) {
        return $resource('/api/cards/:id', { id: '@_id' }, {
            update: {method: 'PUT'},
            query: {method: 'GET', isArray: true},
            get: {method: 'GET'}
        });
    });
