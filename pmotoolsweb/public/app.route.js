// public/js/appRoutes.js
    angular
    .module('app.route', [])
    .config(config);

    function config($routeProvider, $locationProvider) {

    $routeProvider

        // home page
        .when('/', {
            templateUrl: 'components/dashboard/dashboard.html',
            controller: 'MainController'
        })

        // cards page that will use the CardController
        .when('/cards', {
            templateUrl: 'components/card/card.html',
            controller: 'CardController'
        })

        // params page that will use the ParamController
        .when('/param', {
            templateUrl: 'components/param/param.html',
            controller: 'ParamController'
        })

        // sponsors page that will use the SponsorController
        .when('/sponsors', {
            templateUrl: 'components/sponsor/sponsor.html',
            controller: 'SponsorController'
        })

        // teams page that will use the SponsorController
        .when('/teams', {
            templateUrl: 'components/team/team.html',
            controller: 'TeamController'
        })

        // reports page that will use the SponsorController
        .when('/reports', {
            templateUrl: 'components/report/report.html',
            controller: 'ReportController'
        })

        .when('/reports/:id', {
            templateUrl: 'components/report/report.html',
            controller: 'ReportController'
        });

    $locationProvider.html5Mode(true);

};