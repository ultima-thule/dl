(function() {
    'use strict';

    angular
        .module('AuthCallbackCtrl', [])
        .controller('AuthCallbackController', AuthCallbackController);

        AuthCallbackController.$inject = ['$scope', '$location', '$cookies', '$state', 'userService', 'authService', 'userFactory'];

        function AuthCallbackController($scope, $location, $cookies, $state, userService, authService, userFactory) {

            var getQueryParameters = function(str) {
	            return (str || document.location.search).replace(/(^\?)/,'').split("&").map(function(n){return n = n.split("="),this[n[0]] = n[1],this}.bind({}))[0];
            }
            var queryParams = getQueryParameters ($location.url().replace($location.path()+'#', ''));
            $cookies.put('pmo', queryParams.access_token);

            authService.getMe()
            .success(function(data){
                $scope.user = data;
                userService.get({id: $scope.user.info.upn}, function(user) {
                    $scope.userApp = user;
                    if ($scope.userApp.upn === undefined) {
                        $scope.userApp.upn = $scope.user.info.upn;
                        $scope.userApp.avatar = '01';
                        $scope.userApp.roles = ['user'];
                    }
                    $scope.userApp.token = queryParams.access_token;
                    $scope.userApp.last_login = Date.now();
                    $scope.userApp.$update(function() {
                        userFactory.setDisplayName ($scope.user.info.displayName);
                        userFactory.setAvatar ($scope.userApp.avatar);
                        userFactory.setAdmin ($.inArray('admin', $scope.userApp.roles) > -1);
                        userFactory.signIn ();
                    });
                });
            }).error(function(data) {
                console.log('Error: ' + data);
            });

            $state.go('home');
        }
})();
