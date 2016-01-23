// js/services/SponsorService.js
(function() {
    'use strict';

    angular
        .module('SponsorService', [])
        .factory('Sponsors', sponsors);

        function sponsors($resource) {
            return $resource('/api/sponsors/:id', { id: '@_id' }, {
                update: {method: 'PUT'},
                query: {method: 'GET', isArray: true},
                get: {method: 'GET'},
                remove: {method: 'DELETE'},
                save:  {method: 'POST'}
            });
        };

})();
