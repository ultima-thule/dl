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
                authenticate: true,
                resolve: {
                  $title: function() { return 'Dashboard'; }
                }
            })

            // CARDS STATES =================================
            .state('cards', {
                url: '/cards',
                templateUrl: 'components/card/card.html',
                controller: 'CardController',
                authenticate: true,
                resolve: {
                  $title: function() { return 'Initiatives'; }
                }
            })

            .state('cards.bysponsor', {
                url: '/cards',
                templateUrl: 'components/card/card.html',
                controller: 'CardController',
                authenticate: true,
                resolve: {
                  $title: function() { return 'Initiatives by sponsor'; }
                }
            })

            // SPONSORS STATES =================================
            .state('sponsors', {
                url: '/sponsors',
                templateUrl: 'components/sponsor/sponsor.html',
                controller: 'SponsorController',
                authenticate: true,
                resolve: {
                  $title: function() { return 'Sponsors configuration'; }
                }
            })

            // teams page that will use the SponsorController
            .state('teams', {
                url: '/teams',
                templateUrl: 'components/team/team.html',
                controller: 'TeamController',
                authenticate: true,
                resolve: {
                  $title: function() { return 'Teams configuration'; }
                }
            })

            // reports page that will use the SponsorController
            .state('reports', {
                url: '/reports',
                templateUrl: 'components/report/report.html',
                controller: 'ReportController',
                authenticate: true,
                resolve: {
                  $title: function() { return 'IT production reports'; }
                }
            })

            .state('reports.details', {
                url: '/reports/:id',
                templateUrl: 'components/report/report.html',
                controller: 'ReportController',
                authenticate: true
            })

            .state('agileboards', {
                url: '/agileboards',
                templateUrl: 'components/agileboard/agileboard.html',
                controller: 'AgileboardController',
                authenticate: true
            })

            .state('agileboard', {
                url: '/agileboard/:id',
                templateUrl: 'components/agileboard/agileboard.details.html',
                controller: 'AgileboardDetailsController',
                authenticate: true
            })


            .state('userprofile', {
                url: '/users/profile',
                templateUrl: 'components/user/user.profile.html',
                controller: 'UserProfileController',
                authenticate: true,
                  resolve: {
                  $title: function() { return 'User profile'; }
                }
          })

            .state('usersettings', {
                url: '/users/:id/settings',
                templateUrl: 'components/user/user.settings.html',
                controller: 'UserSettingsController',
                authenticate: true,
                resolve: {
                  $title: function() { return 'User settings'; }
                }
            })

            .state('authcallback', {
                url: '/auth/callback',
                templateUrl: 'components/auth/auth.callback.html',
                controller: 'AuthCallbackController'
            })

            .state('login', {
                url: '/login',
                templateUrl: 'components/auth/login.html',
                controller: 'LoginController',
                resolve: {
                  $title: function() { return 'Login'; }
                }
            })

            .state('logout', {
                url: '/logout',
                templateUrl: 'components/auth/logout.html',
                controller: 'LogoutController',
                resolve: {
                  $title: function() { return 'Logout'; }
                }
            });

        $locationProvider.html5Mode(true);
};