(function() {
    'use strict';

    angular
        .module('NavTopCtrl', [])
        .controller('NavTopController', NavTopController);

        NavTopController.$inject = ['$scope', '$cookies', '$mdSidenav', 'authService'];

        function NavTopController($scope, $cookies, $mdSidenav, authService){

            $scope.loggedIn = $cookies.get("pmo") !== undefined;

            $scope.toggleSidenav = function(menuId) {
                $mdSidenav(menuId).toggle();
            };

            var originatorEv;
            $scope.openMenu = function($mdOpenMenu, ev) {
                originatorEv = ev;
                $mdOpenMenu(ev);
            };


            var data = authService.getMe($cookies.get("pmo"))
            .success(function(data){
                console.log(data);
            }).error(function(data) {
                console.log('Error: ' + data);
            });

        };
})();