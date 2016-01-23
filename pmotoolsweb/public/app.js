// public/js/app.js

angular
    .module('pmoApp', ['ngRoute', 'ngMaterial', 'ngResource', 'ngFileSaver', 'appRoutes', 'MainCtrl',
        'CardCtrl', 'CardService', 'ParamCtrl',
        'SponsorCtrl', 'SponsorService', 'TeamCtrl', 'TeamService',
        'ReportCtrl', 'ReportService', 'ParamService', 'DashboardService',
        'mdDataTable', 'mdtTemplates', 'md.data.table',
        'chart.js']);


angular
    .module('pmoApp')
    .config(function($mdThemingProvider) {
    // Configure a dark theme with primary foreground yellow
    $mdThemingProvider.theme('docs-dark', 'default')
      .primaryPalette('yellow')
      .dark();
});

//app.config(function($mdThemingProvider) {
//  $mdThemingProvider.theme('default')
//    .primaryPalette('indigo')
//    .accentPalette('amber')
//    .warnPalette('pink')
//    .backgroundPalette('grey');
//  $mdThemingProvider.theme('input', 'default')
//    .primaryPalette('yellow')
//});
