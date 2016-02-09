(function() {
    'use strict';

    angular
        .module('LoginCtrl', [])
        .controller('LoginController', LoginController);

        LoginController.$inject = ['$scope', '$state'];

        function LoginController($scope, $state) {
        }
})();
