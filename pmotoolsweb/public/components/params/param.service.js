// js/services/ParamService.js
(function() {
    'use strict';

    angular
        .module('ParamService', [])
        .factory('paramService', paramService);

        function paramService($http) {
            return {
                getId : function(id) {
                    return $http.get('/api/params/' + id);
                }
            }
        };

})();