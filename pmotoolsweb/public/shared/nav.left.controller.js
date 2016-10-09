(function() {
    'use strict';

    angular
        .module('NavLeftCtrl', [])
        .controller('NavLeftController', NavLeftController);

        NavLeftController.$inject = ['$scope', '$mdSidenav', '$location', '$cookies', 'userFactory'];

        function NavLeftController($scope, $mdSidenav, $location, $cookies, userFactory) {

            $scope.$watch(function () { return userFactory.isSignedIn(); }, function (newValue, oldValue) {
                $scope.isLoggedIn = newValue;
            });

            $scope.$watch(function () { return userFactory.getAdmin(); }, function (newValue, oldValue) {
                $scope.isAdmin = newValue;
            });


            $scope.menu = [
                {
                  link : '/',
                  title: 'Dashboard',
                  icon: 'dashboard'
                },
                {
                  link : '/reports',
                  title: 'Production reports',
                  icon: 'insert_chart'
                },
                {
                  link : '/agenda',
                  title: 'Agenda planning reports',
                  icon: 'schedule'
                },
                {
                  link : '/agendabyteam',
                  title: 'Agenda planning by teams',
                  icon: 'storage'
                },
                {
                  link : '/pws',
                  title: 'PW generation',
                  icon: 'description'
                }
//                {
//                  link : '/agileboards',
//                  title: 'Agile Boards',
//                  icon: 'message'
//                }
            ];

            $scope.admin = [
                {
                  link : '/cards',
                  title: 'Initiatives',
                  icon: 'message'
                },
                {
                  link : '/sponsors',
                  title: 'Sponsors',
                  icon: 'attach_money'
                },
                {
                  link : '/teams',
                  title: 'Teams',
                  icon: 'people'
                },
                {
                    link: '/params',
                    title: 'Parameters',
                    icon: 'settings'
                }
            ];
        };
})();