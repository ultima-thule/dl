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
                templateUrl: 'components/dashboard/dashboard.html'
            })

            // CARDS STATES =================================
            .state('cards', {
                url: '/cards',
                templateUrl: 'components/card/card.html',
                controller: 'CardController'
            })

            // SPONSORS STATES =================================
            .state('sponsors', {
                url: '/sponsors',
                templateUrl: 'components/sponsor/sponsor.html',
                controller: 'SponsorController'
            })

            // teams page that will use the SponsorController
            .state('teams', {
                url: '/teams',
                templateUrl: 'components/team/team.html',
                controller: 'TeamController'
            })

            // reports page that will use the SponsorController
            .state('reports', {
                url: '/reports',
                templateUrl: 'components/report/report.html',
                controller: 'ReportController'
            })

            .state('reports.details', {
                url: '/reports/:id',
                templateUrl: 'components/report/report.html',
                controller: 'ReportController'
            });

        $locationProvider.html5Mode(true);
};