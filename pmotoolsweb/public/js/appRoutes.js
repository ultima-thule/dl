// public/js/appRoutes.js
    angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider

        // home page
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'MainController'
        })

        // cards page that will use the CardController
        .when('/cards', {
            templateUrl: 'views/card.html',
            controller: 'CardController'
        })

        // params page that will use the ParamController
        .when('/params', {
            templateUrl: 'views/params.html',
            controller: 'ParamsController'
        })

        // sponsors page that will use the SponsorController
        .when('/sponsors', {
            templateUrl: 'views/sponsor.html',
            controller: 'SponsorController'
        })

        // teams page that will use the SponsorController
        .when('/teams', {
            templateUrl: 'views/team.html',
            controller: 'TeamController'
        })

        // reports page that will use the SponsorController
        .when('/reports', {
            templateUrl: 'views/report.html',
            controller: 'ReportController'
        })

        .when('/reports/:id', {
            templateUrl: 'views/report.html',
            controller: 'ReportController'
        });


    $locationProvider.html5Mode(true);

}]);