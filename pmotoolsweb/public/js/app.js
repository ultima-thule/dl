// public/js/app.js


var app = angular.module('sampleApp', ['ngRoute', 'ngMaterial', 'ngFileSaver', 'appRoutes', 'MainCtrl',
    'CardCtrl', 'CardService', 'ParamsCtrl',
    'SponsorCtrl', 'SponsorService', 'TeamCtrl', 'TeamService',
    'ReportCtrl', 'ReportService', 'ConfigParamService',
    'mdDataTable', 'mdtTemplates', 'md.data.table', 'TabletestCtrl']);


app.config(function($mdThemingProvider) {
    // Configure a dark theme with primary foreground yellow
    $mdThemingProvider.theme('docs-dark', 'default')
      .primaryPalette('yellow')
      .dark();
});

app.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('teal')
    .accentPalette('orange')
    .warnPalette('pink')
    .backgroundPalette('grey');
  $mdThemingProvider.theme('input', 'default')
    .primaryPalette('yellow')
});
