(function() {
    'use strict';

    angular
        .module('NavTopCtrl', [])
        .controller('NavTopController', NavTopController);

        NavTopController.$inject = ['$scope', '$mdSidenav'];

        function NavTopController($scope, $mdSidenav){

            $scope.toggleSidenav = function(menuId) {
                $mdSidenav(menuId).toggle();
            };

            var originatorEv;
            $scope.openMenu = function($mdOpenMenu, ev) {
                originatorEv = ev;
                $mdOpenMenu(ev);
            };

        };
})();