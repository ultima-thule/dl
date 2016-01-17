// public/js/app.js


var app = angular.module('pmoApp', ['ngRoute', 'ngMaterial', 'ngResource', 'ngFileSaver', 'appRoutes', 'MainCtrl',
    'CardCtrl', 'CardService', 'ParamsCtrl',
    'SponsorCtrl', 'SponsorService', 'TeamCtrl', 'TeamService',
    'ReportCtrl', 'ReportService', 'ConfigParamService',
    'mdDataTable', 'mdtTemplates', 'md.data.table',
    'SynchroCtrl', 'SynchroService']);


app.config(function($mdThemingProvider) {
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
