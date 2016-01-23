// js/services/ParamService.js
angular.module('ParamService', [])

    // super simple service
    // each function returns a promise object
    .factory('Param', function($http) {
        return {
            getId : function(id) {
                return $http.get('/api/params/' + id);
            }
        }
    });
