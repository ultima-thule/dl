(function() {
    'use strict';

    angular
        .module('NavLeftCtrl', [])
        .controller('NavLeftController', NavLeftController);

        NavLeftController.$inject = ['$scope', '$mdSidenav', '$location'];

        function NavLeftController($scope, $mdSidenav, $location){

            $scope.toggleSidenav = function(menuId) {
                $mdSidenav(menuId).toggle();
            };

            $scope.navigateTo = function(page) {
                $location.path = page;
            };

            $scope.menu = [
                {
                  link : '/',
                  title: 'Dashboard',
                  icon: 'dashboard'
                },
                {
                  link : '/reports',
                  title: 'Reports',
                  icon: 'insert_chart'
                },
                {
                  link : '/cards',
                  title: 'Initiatives',
                  icon: 'message'
                }
            ];

            $scope.admin = [
                {
                  link : '/sponsors',
                  title: 'Sponsors',
                  icon: 'attach_money'
                },
                {
                  link : '/teams',
                  title: 'Teams',
                  icon: 'people'
                }
            ];
        };
})();