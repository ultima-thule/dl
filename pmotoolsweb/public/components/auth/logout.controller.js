(function() {
    'use strict';

    angular
        .module('LogoutCtrl', [])
        .controller('LogoutController', LogoutController);

        LogoutController.$inject = ['$scope', '$state', '$cookies'];

        function LogoutController($scope, $state, $cookies) {
            $cookies.put('pmo', undefined);
            $state.go('home');
        }
})();
