// js/services/CardeService.js
(function() {
    'use strict';

    angular
        .module('CardService', [])
        .factory('cardService', cardService);

        function cardService($resource) {
            return $resource('/api/cards/:id', { id: '@_id' }, {
                update: {method: 'PUT'},
                query: {method: 'GET', isArray: true},
                get: {method: 'GET'}
            });
        }

})();