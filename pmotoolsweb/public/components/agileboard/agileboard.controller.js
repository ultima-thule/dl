// public/js/controllers/AgileboardCtrl.js
(function() {
    'use strict';

    angular
        .module('AgileboardCtrl', [])
        .controller('AgileboardController', AgileboardController);

        AgileboardController.$inject = ['$scope', 'agileboardService'];

        function AgileboardController($scope, agileboardService) {

            $scope.title = "Agile boards"

            agileboardService.getAll()
            .success(function(data){
                $scope.boards = data;
            }).error(function(data) {
                console.log('Error: ' + data);
            });
        }

})();