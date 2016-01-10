// js/services/ConfigParamService.js
angular.module('ConfigParamService', [])

    // super simple service
    // each function returns a promise object
    .factory('ConfigParams', function($http) {
        return {
            getId : function(id) {
                return $http.get('/api/configparams/' + id);
            }
        }
    });
