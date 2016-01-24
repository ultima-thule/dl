// public/js/app.js


angular
    .module('pmoApp')
    .config(configure);

    configure.$inject = ['$mdThemingProvider'];

    function configure($mdThemingProvider) {
        // Configure a dark theme with primary foreground yellow
        $mdThemingProvider.theme('docs-dark', 'default')
          .primaryPalette('yellow')
          .dark();
    };

//app.config(function($mdThemingProvider) {
//  $mdThemingProvider.theme('default')
//    .primaryPalette('indigo')
//    .accentPalette('amber')
//    .warnPalette('pink')
//    .backgroundPalette('grey');
//  $mdThemingProvider.theme('input', 'default')
//    .primaryPalette('yellow')
//});
