// js/services/SponsorService.js
angular.module('SponsorService', [])

    // super simple service
    // each function returns a promise object
    .factory('Sponsors', function($http) {
        return {
            get : function() {
                return $http.get('/api/sponsors');
            },
            create : function(sponsorData) {
                return $http.post('/api/sponsors', sponsorData);
            },
            delete : function(id) {
                return $http.delete('/api/sponsors/' + id);
            }
        }
    });