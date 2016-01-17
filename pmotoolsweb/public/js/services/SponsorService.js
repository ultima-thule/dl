// js/services/SponsorService.js
angular.module('SponsorService', [])

    .factory('Sponsors', function($resource) {
        return $resource('/api/sponsors/:id', { id: '@_id' }, {
            update: {method: 'PUT'},
            query: {method: 'GET', isArray: true},
            get: {method: 'GET'},
            remove: {method: 'DELETE'},
            save:  {method: 'POST'}
        });
    });
