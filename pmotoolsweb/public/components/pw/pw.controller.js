// public/js/controllers/PwController.js
(function() {
    'use strict';

    angular
        .module('PwCtrl', ['ngMaterial', 'mdDataTable'])
        .controller('PwController', PwController);

        PwController.$inject = ['$scope', '$http', '$routeParams', '$mdToast', '$timeout', 'pwService', 'userFactory', 'jiraboardService'];

        function PwController($scope, $http, $routeParams, $mdToast, $timeout, pwService, userFactory, jiraboardService) {
            $scope.formData = {};
            $scope.title = "PW Automation";
            $scope.projectName = "";
            $scope.sprintID = "";
            $scope.confLink = "";

            $scope.loadSprints = loadSprints;
            $scope.getIcon = getIcon;

            $scope.$watch(function () { return userFactory.getJiraBoards(); }, function (newValue, oldValue) {
                $scope.boards = newValue;
            });

            function loadSprints () {
                $scope.sprints = [];

                jiraboardService.getSprints ($scope.selBoard, 1)
                .success(function(data){
                    var children = $scope.sprints.concat(data);
                    $scope.sprints = children;
                })
                .error(function(data) {
                })
                .then (function () {
                    jiraboardService.getSprints ($scope.selBoard, 2)
                    .success(function(data){
                        var children = $scope.sprints.concat(data);
                         $scope.sprints = children;
                    }).then (function () {
                    jiraboardService.getSprints ($scope.selBoard, 3)
                    .success(function(data){
                            var children = $scope.sprints.concat(data);
                            $scope.sprints = _.sortBy(children, "startDate").reverse();
                        })
                    })
                });
            };

            function getIcon (name) {
                if (name==="active"){
                    return "cached";
                }
                else if (name==="future"){
                    return "schedule";
                }
                return "done";
            }

            $scope.$watch('selBoard', function(newval, oldval) {
                if (newval) {
                    $scope.sprints = null;
                    $scope.confLink = "";
                }
            });

            $scope.$watch('selSprint', function(newval, oldval) {
                if (newval) {
                    $scope.confLink = "";
                }
            });


            $scope.$watch('projectName', function(newval, oldval) {
                if (newval) {
                    $scope.confLink = "";
                }
            });

            $scope.generatePW = function() {
                $scope.isLoading = true;
                pwService.generate ($scope.projectName, $scope.selSprint)
                .success(function(data){
                    $scope.confLink = "http://doc.grupa.onet/pages/viewpage.action?pageId=" + data;
                    showMessage ("Sprint page created, check Confluence link!");
                    $scope.isLoading = false;
                })
                .error(function(data) {
                    $scope.isLoading = false;
                    showMessage ("Sprint page cannot be created, error occured.");
                });
            }

            // if requested to download a file
            if ($routeParams.project)
            {
                pwService.generate ($routeParams.project, $routeParams.withsubtasks)
                .success(function(data){
                    var blob = new Blob([data], {
                        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                        });

                    var date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
                    var filename = "report " + date + ".xlsx";
                    FileSaver.saveAs(blob, filename);
                    $location.path('/pws');
                }).error(function(data) {
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