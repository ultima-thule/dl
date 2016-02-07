// public/js/app.js '


angular
    .module('pmoApp')
    .config(configure);

    configure.$inject = ['$mdThemingProvider', 'ChartJsProvider'];

    function configure($mdThemingProvider, ChartJsProvider) {

//        $mdThemingProvider
//            .theme('mainTheme')
//            .primaryPalette('indigo')
//            .accentPalette('pink')
//            .warnPalette('red')
//            .backgroundPalette('blue-grey')
//
//        $mdThemingProvider
//            .theme('hoverTheme')
//            .primaryPalette('indigo')
//            .accentPalette('pink')
//            .warnPalette('red')
//            .backgroundPalette('grey')
//
//        // Configure a dark theme with primary foreground yellow
//        $mdThemingProvider.theme('docs-dark')
//          .primaryPalette('yellow')
//          .dark()
//
//        $mdThemingProvider.setDefaultTheme('mainTheme');

        ChartJsProvider.setOptions({
            responsive: true,
            maintainAspectRatio: false
        });
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

