// js/services/TeamService.js
angular.module('TeamService', [])

    // super simple service
    // each function returns a promise object
    .factory('Teams', function($http) {
        return {
            get : function() {
                return $http.get('/api/teams');
            },
            create : function(teamData) {
                return $http.post('/api/teams', teamData);
            },
            delete : function(id) {
                return $http.delete('/api/teams/' + id);
            }
        }
    });