// public/js/controllers/TeamCtrl.js
(function() {
    'use strict';

    angular
        .module('TeamCtrl', ['ngMaterial', 'mdDataTable'])
        .controller('TeamController', TeamController);

        function TeamController($scope, $http, $mdDialog, $mdToast, Teams) {

            $scope.formData = {};

            $scope.title = "Teams configuration";

            $scope.query = {
                limit: '10',
                page: 1
            };

            $scope.showDialog = showDialog;

            $scope.teams = Teams.query(function() {
            });

            //show message after CRUD operation
            function simpleToastBase(message, position, delay, action) {
                $mdToast.show(
                    $mdToast.simple()
                        .content(message)
                        .position(position)
                        .hideDelay(delay)
                        .action(action)
                );
            }

            function showDialog(operation, data, event) {
                console.log(data);
                var tempData = undefined;
                if (data === undefined) {
                    tempData = {};
                } else {
                    tempData = {
                        _id: data._id,
                        name: data.name,
                        location: data.location,
                        default_category: data.default_category,
                        sponsor_name: data.sponsor_name
                    };
                }
                $mdDialog.show({
                    templateUrl: 'editor.html',
                    targetEvent: event,
                    locals: {
                        selectedItem: data,
                        oldItem: tempData,
                        dataCollection: $scope.teams,
                        operation: operation
                    },
                    bindToController: true,
                    controller: DialogController,
                    parent: angular.element(document.body)
                })
                .then(
                    function (result) {
                        showMessage(result);
                    }
                );
            }

            //shows toast with message
            function showMessage(message) {
                simpleToastBase(message, 'bottom right', 3000, 'Close');
            }

            //Dialog's controller
            function DialogController($scope, $filter, $resource, $mdDialog, $mdToast, operation, selectedItem, dataCollection, Teams, Sponsors) {
                $scope.view = {
                    dataCollection: dataCollection,
                    selectedItem: selectedItem,
                    operation: 'Details'
                };

                $scope.categories = ('IT Platforms;Business').split(';').map(function(category) {
                        return {name: category};
                });

                $scope.locations = ('Kraków;Warszawa;Wrocław').split(';').map(function(location) {
                        return {name: location};
                });

                $scope.pmos = ('PMO Asia;PMO Sławek').split(';').map(function(pmo) {
                        return {name: pmo};
                });

                $scope.sponsors = Sponsors.query(function() {
                });


                switch (operation) {
        //            case 'C':
        //                $scope.view.operation = 'Create';
        //                break;
                    case 'E':
                        $scope.view.operation = 'Edit';
                        break;
                    case 'R':
                        $scope.view.operation = 'Details';
                        break;
                    default:
                        $scope.view.operation = 'Details';
                        break;
                }

                $scope.back = back;
                $scope.save = save;

                function back() {
                    $mdDialog.cancel();
                }

                function create() {
                }

                function save() {
        //            console.log($scope.view.selectedItem)
                    if ($scope.view.selectedItem._id === undefined) create();
                    else edit();
                }

                function edit() {
                    var found = $filter('filter')($scope.view.dataCollection, $scope.view.selectedItem._id)
                    if (found.length == 1) {
                        $scope.view.selectedItem.$update(function() {
                            $mdDialog.hide('Team was successfully updated.');
                        })
                    } else {
                        $mdDialog.hide('Cannot modify selected team.');
                    }
                }
            }

        };

})();