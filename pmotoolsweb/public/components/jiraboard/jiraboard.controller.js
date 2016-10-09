// public/js/controllers/JiraboardController.js
(function() {
    'use strict';

    angular
        .module('JiraboardCtrl', ['ngMaterial', 'mdDataTable'])
        .controller('JiraboardCtrl', JiraboardCtrl);

        JiraboardCtrl.$inject = ['$scope', '$http', '$mdToast', 'jiraboardService'];

        function JiraboardCtrl($scope, $http, $mdToast, jiraboardService) {
            $scope.formData = {};
            $scope.title = "Jira boards";
        };

})();