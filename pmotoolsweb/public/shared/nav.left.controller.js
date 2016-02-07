(function() {
    'use strict';

    angular
        .module('NavLeftCtrl', [])
        .controller('NavLeftController', NavLeftController);

        NavLeftController.$inject = ['$scope', '$mdSidenav', '$location'];

        function NavLeftController($scope, $mdSidenav, $location){

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
//                {
//                  link : '/agileboards',
//                  title: 'Agile Boards',
//                  icon: 'message'
//                }
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