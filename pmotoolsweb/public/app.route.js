// public/js/appRoutes.js
    angular
    .module('app.route', ['ui.router'])
    .config(config);

    function config($stateProvider, $urlRouterProvider, $locationProvider) {

        $urlRouterProvider.otherwise('/');

        $stateProvider
            // HOME STATES AND NESTED VIEWS ========================================
            .state('home', {
                url: '/',
                templateUrl: 'components/dashboard/dashboard.html',
                controller: 'DashboardController',
                resolve: {
                  $title: function() { return 'Dashboard'; }
                }
            })

            // CARDS STATES =================================
            .state('cards', {
                url: '/cards',
                templateUrl: 'components/card/card.html',
                controller: 'CardController',
                resolve: {
                  $title: function() { return 'Initiatives'; }
                }

            })

            // SPONSORS STATES =================================
            .state('sponsors', {
                url: '/sponsors',
                templateUrl: 'components/sponsor/sponsor.html',
                controller: 'SponsorController',
                resolve: {
                  $title: function() { return 'Sponsors configuration'; }
                }
            })

            // teams page that will use the SponsorController
            .state('teams', {
                url: '/teams',
                templateUrl: 'components/team/team.html',
                controller: 'TeamController',
                resolve: {
                  $title: function() { return 'Teams configuration'; }
                }
            })

            // reports page that will use the SponsorController
            .state('reports', {
                url: '/reports',
                templateUrl: 'components/report/report.html',
                controller: 'ReportController',
                resolve: {
                  $title: function() { return 'IT production reports'; }
                }
            })

            .state('reports.details', {
                url: '/reports/:id',
                templateUrl: 'components/report/report.html',
                controller: 'ReportController'
            })

            .state('agileboards', {
                url: '/agileboards',
                templateUrl: 'components/agileboard/agileboard.html',
                controller: 'AgileboardController'
            })

            .state('agileboard', {
                url: '/agileboard/:id',
                templateUrl: 'components/agileboard/agileboard.details.html',
                controller: 'AgileboardDetailsController'
            })


            .state('userprofile', {
                url: '/users/:id/profile',
                templateUrl: 'components/user/user.profile.html',
                controller: 'UserProfileController'
            })

            .state('usersettings', {
                url: '/users/:id/settings',
                templateUrl: 'components/user/user.settings.html',
                controller: 'UserSettingsController'
            });

        $locationProvider.html5Mode(true);
};