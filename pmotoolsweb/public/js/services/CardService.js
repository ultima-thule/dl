// js/services/CardeService.js
angular.module('CardService', [])

    // super simple service
    // each function returns a promise object
    .factory('Cards', function($http) {
        return {
            get : function() {
                return $http.get('/api/cards');
            }
        }
    });