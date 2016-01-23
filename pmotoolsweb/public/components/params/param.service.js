// js/services/ParamService.js
(function() {
    'use strict';

    angular
        .module('ParamService', [])
        .factory('Param', params);

        function params($http) {
            return {
                getId : function(id) {
                    return $http.get('/api/params/' + id);
                }
            }
        };

})();