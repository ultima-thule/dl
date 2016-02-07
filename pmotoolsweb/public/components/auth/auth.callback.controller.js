(function() {
    'use strict';

    angular
        .module('AuthCallbackCtrl', [])
        .controller('AuthCallbackController', AuthCallbackController);

        AuthCallbackController.$inject = ['$scope', '$location', '$cookies', '$state'];

        function AuthCallbackController($scope, $location, $cookies, $state) {

            var getQueryParameters = function(str) {
	            return (str || document.location.search).replace(/(^\?)/,'').split("&").map(function(n){return n = n.split("="),this[n[0]] = n[1],this}.bind({}))[0];
            }
            console.log($location.url());
            var queryParams = getQueryParameters ($location.url().replace($location.path()+'#', ''));
            $cookies.put('pmo', queryParams.access_token);
            $state.go('home');
        }
})();
