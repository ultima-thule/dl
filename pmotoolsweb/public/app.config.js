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

    runAuthenticate.$inject = ['$rootScope', '$state', '$cookies', 'userFactory', 'userService', 'authService'];
    function runAuthenticate ($rootScope, $state, $cookies, userFactory, userService, authService) {
        $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
            var token = $cookies.get('pmo');
            // User isn’t authenticated
            if (toState.authenticate && token===undefined){
                userFactory.signOff ();
                $state.transitionTo("login");
                event.preventDefault();
            }
            else if (toState.authenticate && token!==undefined && userFactory.isSignedIn()===false) {
                    authService.getMe()
                    .success(function(data){
                        userService.get({id: data.info.upn}, function(user) {
                            var userApp = user;
                            if (userApp.upn === undefined) {
                                userApp.upn = data.info.upn;
                                userApp.avatar = '01';
                                userApp.roles = ['user'];
                                userApp.jiraBoards = [];
                            }
                            userApp.token = token;
                            userApp.last_login = Date.now();
                            userApp.$update(function() {
                                userFactory.setDisplayName (data.info.displayName);
                                userFactory.setAvatar (userApp.avatar);
                                userFactory.setAdmin ($.inArray('admin', userApp.roles) > -1);
                                userFactory.setJiraBoards(userApp.jiraBoards);
                                userFactory.signIn ();
                            });
                        });
                    })
                    .error(function(data) {
                        console.log('Error: ' + data);
                    });
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

