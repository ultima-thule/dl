// public/js/app.js

angular
    .module('pmoApp', [
        /* Shared modules */
        'app.core',
        'MainCtrl',
        /* Feature areas */
        'CardCtrl', 'CardService', 'ParamCtrl',
        'SponsorCtrl', 'SponsorService', 'TeamCtrl', 'TeamService',
        'ReportCtrl', 'ReportService', 'ParamService', 'DashboardService'
    ]);

