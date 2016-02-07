// public/js/controllers/AgileboardCtrl.js
(function() {
    'use strict';

    angular
        .module('AgileboardDetailsCtrl', [])
        .controller('AgileboardDetailsController', AgileboardDetailsController);

        AgileboardDetailsController.$inject = ['$scope', '$stateParams', 'agileboardService'];

        function AgileboardDetailsController($scope, $stateParams, agileboardService) {

            $scope.title = "Agile board details"

            console.log ($stateParams.id);

            agileboardService.getBoard($stateParams.id)
            .success(function(data){
                $scope.board = data;
            }).error(function(data) {
                console.log('Error: ' + data);
            });
        }

})();