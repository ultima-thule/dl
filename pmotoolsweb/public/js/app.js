// public/js/app.js
var app = angular.module('sampleApp', ['ngRoute', 'ngMaterial', 'ngFileSaver', 'appRoutes', 'MainCtrl', 'CardCtrl', 'CardService',
    'ParamsCtrl', 'SponsorCtrl', 'TeamCtrl', 'TeamService', 'ReportCtrl', 'ReportService', 'ConfigParamService']);


app.config(function($mdThemingProvider) {
    // Configure a dark theme with primary foreground yellow
    $mdThemingProvider.theme('docs-dark', 'default')
      .primaryPalette('yellow')
      .dark();
});

app.config(function($mdThemingProvider) {
  var customBlueMap = $mdThemingProvider.extendPalette('light-blue', {
    'contrastDefaultColor': 'light',
    'contrastDarkColors': ['50'],
    '50': 'ffffff'
  });
  $mdThemingProvider.definePalette('customBlue', customBlueMap);
  $mdThemingProvider.theme('default')
    .primaryPalette('customBlue', {
      'default': '500',
      'hue-1': '50'
    })
    .accentPalette('pink');
  $mdThemingProvider.theme('input', 'default')
        .primaryPalette('grey')
});