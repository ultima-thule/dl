// public/js/controllers/PwController.js
(function() {
    'use strict';

    angular
        .module('PwCtrl', ['ngMaterial', 'mdDataTable'])
        .controller('PwController', PwController);

        PwController.$inject = ['$scope', '$http', '$mdToast', '$timeout', 'pwService', 'userFactory', 'jiraboardService'];

        function PwController($scope, $http, $mdToast, $timeout, pwService, userFactory, jiraboardService) {
            $scope.formData = {};
            $scope.title = "PW generation";
            $scope.projectName = "";
            $scope.sprintID = "";

            $scope.loadSprints = loadSprints;

            $scope.$watch(function () { return userFactory.getJiraBoards(); }, function (newValue, oldValue) {
                $scope.boards = newValue;
            });

            function loadSprints () {
                $scope.sprints = null;
                jiraboardService.getSprints ($scope.selBoard)
                .success(function(data){
                    $scope.sprints = data;
                })
                .error(function(data) {
                });
            };

            $scope.$watch('selBoard', function(newval, oldval) {
                if (newval) {
                    $scope.sprints = null;
                }
            });


            $scope.generatePW = function() {
                $scope.isLoading = true;
                pwService.generate ($scope.projectName, $scope.selSprint)
                .success(function(data){
                    showMessage ('Generated, check Confluence!');
                    $scope.isLoading = false;
                })
                .error(function(data) {
                    $scope.isLoading = false;
                });
            }

            $scope.simpleToastBase = simpleToastBase;
            $scope.showMessage = showMessage;

            //show message after generation
            function simpleToastBase(message, position, delay, action) {
                $mdToast.show(
                    $mdToast.simple()
                        .content(message)
                        .position(position)
                        .hideDelay(delay)
                        .action(action)
                );
            }

            //shows toast with message
            function showMessage(message) {
                simpleToastBase(message, 'bottom right', 3000, 'Close');
            }
        };

})();