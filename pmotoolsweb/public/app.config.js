// public/js/app.js '


angular
    .module('pmoApp')
    .config(configure);

angular
    .module('pmoApp')
    .run(runAuthenticate);

    configure.$inject = ['$mdThemingProvider', '$httpProvider', 'ChartJsProvider'];
    function configure($mdThemingProvider, $httpProvider, ChartJsProvider) {

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

        $httpProvider.interceptors.push(function($q, $location) {
        	return { 
        		response: function(response) { 
	        	// do something on success 
		        	return response; }, 
	        	responseError: function(response) { 
	        		if (response.status === 401) 
	        			$location.url('/auth/provider'); 
	        		return $q.reject(response); 
	        	} 
	        }; 
	    }); 
    };

    runAuthenticate.$inject = ['$rootScope', '$state', '$cookies'];
    function runAuthenticate ($rootScope, $state, $cookies) {
        $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
            if (toState.authenticate && $cookies.get('pmo') === undefined){
                // User isn’t authenticated
                $state.transitionTo("login");
                event.preventDefault();
            }
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

