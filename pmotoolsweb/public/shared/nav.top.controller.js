(function() {
    'use strict';

    angular
        .module('NavTopCtrl', [])
        .controller('NavTopController', NavTopController);

        NavTopController.$inject = ['$rootScope', '$scope', '$cookies', '$mdSidenav', 'authService', 'userService', 'userFactory'];

        function NavTopController($rootScope, $scope, $cookies, $mdSidenav, authService, userService, userFactory){

            $scope.loggedIn = $cookies.get("pmo") !== undefined;

            $scope.toggleSidenav = function(menuId) {
                $mdSidenav(menuId).toggle();
            };

            var originatorEv;
            $scope.openMenu = function($mdOpenMenu, ev) {
                originatorEv = ev;
                $mdOpenMenu(ev);
            };

            $scope.$watch(function () { return userFactory.getDisplayName(); }, function (newValue, oldValue) {
                $scope.displayName = newValue;
            });

            $scope.$watch(function () { return userFactory.getAvatar(); }, function (newValue, oldValue) {
                $scope.avatar = newValue;
            });

            $scope.$watch(function () { return userFactory.isSignedIn(); }, function (newValue, oldValue) {
                $scope.isLoggedIn = newValue;
            });

        };
})();