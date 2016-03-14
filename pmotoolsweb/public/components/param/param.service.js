// js/services/ParamService.js
(function() {
    'use strict';

    angular
        .module('ParamService', [])
        .factory('paramService', paramService)
        .factory('namedParamService', namedParamService);

        function paramService($resource) {
            return $resource('/api/params/:id', { id: '@_id' }, {
                update: {method: 'PUT'},
                query: {method: 'GET', isArray: true},
                get: {method: 'GET'},
            });
        };

        function namedParamService($http) {
            return {
                getByKey : function(id) {
                    return $http.get('/api/namedparams/' + id);
                }
            }
        };

})();
