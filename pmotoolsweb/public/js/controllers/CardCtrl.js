// public/js/controllers/CardCtrl.js

angular.module('CardCtrl', [])
.controller('CardController', function($scope, $http, Cards) {

    $scope.title = "Current initiatives";

    $scope.query = {
        limit: '10',
        page: 1
    };

    // when landing on the page, get all cards and show them
    Cards.get('/api/cards')
        .success(function(data) {
            $scope.cards = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });


});
