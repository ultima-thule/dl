// public/js/controllers/CardCtrl.js

angular.module('CardCtrl', [])
.controller('CardController', function($scope, $http, Cards) {

    $scope.title = "Current initiatives";

    // when landing on the page, get all teams and show them
    Cards.get('/api/cards')
        .success(function(data) {
            $scope.cards = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });


});
