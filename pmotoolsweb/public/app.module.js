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
        'AgendabyteamCtrl', 'AgendabyteamService',
        'ParamService', 'DashboardService',
        'AgileboardCtrl', 'AgileboardService', 'AgileboardDetailsCtrl',
        'PwCtrl', 'PwService',
        'UserProfileCtrl', 'UserSettingsCtrl', 'UserService',
        'ParamCtrl', 'ParamService',
        'LoginCtrl', 'LogoutCtrl',
        'AuthCallbackCtrl', 'AuthService'
    ]);

