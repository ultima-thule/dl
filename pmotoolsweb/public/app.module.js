// public/js/app.js

angular
    .module('pmoApp', [
        /* Shared modules */
        'app.core',
        'NavLeftCtrl', 'NavTopCtrl',
        /* Feature areas */
        'DashboardCtrl',
        'CardCtrl', 'CardService', 'ParamCtrl',
        'SponsorCtrl', 'SponsorService', 'TeamCtrl', 'TeamService',
        'ReportCtrl', 'ReportService',
        'AgendaCtrl', 'AgendaService',
        'ParamService', 'DashboardService',
        'AgileboardCtrl', 'AgileboardService', 'AgileboardDetailsCtrl',
        'UserProfileCtrl', 'UserSettingsCtrl', 'UserService',
        'ParamCtrl', 'ParamService',
        'LoginCtrl', 'LogoutCtrl',
        'AuthCallbackCtrl', 'AuthService'
    ]);

