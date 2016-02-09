(function() {
    'use strict';

    angular
        .module('LogoutCtrl', [])
        .controller('LogoutController', LogoutController);

        LogoutController.$inject = ['$scope', '$state', '$cookies', 'userFactory'];

        function LogoutController($scope, $state, $cookies, userFactory) {
            $cookies.put('pmo', undefined);

            userFactory.signOff ();

            $state.go('login');
        }
})();
