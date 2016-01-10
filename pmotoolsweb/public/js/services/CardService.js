// public/js/services/CardService.js
angular.module('CardService', []).factory('Card', ['$http', function($http) {

    return {
        // call to get all cards
        get : function() {
            return $http.get('/api/cards');
        },


        // these will work when more API routes are defined on the Node side of things
        // call to POST and create a new card
        create : function(cardData) {
            return $http.post('/api/cards', cardData);
        },

        // call to DELETE a card
        delete : function(id) {
            return $http.delete('/api/cards/' + id);
        }
    }

}]);