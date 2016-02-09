(function() {
    'use strict';

    angular
        .module('NavTopCtrl', [])
        .controller('NavTopController', NavTopController);

        NavTopController.$inject = ['$rootScope', '$scope', '$cookies', '$mdSidenav', 'authService', 'userService'];

        function NavTopController($rootScope, $scope, $cookies, $mdSidenav, authService, userService){

            $scope.loggedIn = $cookies.get("pmo") !== undefined;

            $scope.toggleSidenav = function(menuId) {
                $mdSidenav(menuId).toggle();
            };

            var originatorEv;
            $scope.openMenu = function($mdOpenMenu, ev) {
                originatorEv = ev;
                $mdOpenMenu(ev);
            };


            $scope.displayName = '';
            authService.getMe()
            .success(function(data){
                userService.get({id: data.info.upn}, function(user) {
                    $scope.userApp = user;
                    $scope.displayName = $scope.userApp.upn || '';
                });

            }).error(function(data) {
                console.log('Error: ' + data);
            });

            console.log($rootScope.currentUserSignedIn);
        };
})();