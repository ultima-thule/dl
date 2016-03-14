// public/js/controllers/ParamCtrl.js
(function() {
    'use strict';

    angular
        .module('ParamCtrl', ['ngMaterial', 'mdDataTable'])
        .controller('ParamController', ParamController)
        .controller('ParamDetailsController', ParamDetailsController);

        ParamController.$inject = ['$scope', '$http', '$mdDialog', '$mdToast', 'paramService'];
        ParamDetailsController.$inject = ['$scope', '$filter', '$resource', '$mdDialog', '$mdToast',
            'operation', 'selectedItem', 'dataCollection', 'paramService'];


        function ParamController($scope, $http, $mdDialog, $mdToast, paramService) {
            $scope.formData = {};
            $scope.title = "System parameters";
            $scope.query = {
                limit: '10',
                page: 1
            };

            $scope.params = paramService.query(function() {
            });

            $scope.showDialog = showDialog;
            $scope.simpleToastBase = simpleToastBase;
            $scope.showMessage = showMessage;

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
                var tempData = undefined;
                if (data === undefined) {
                    tempData = {};
                } else {
                    tempData = {
                        _id: data._id,
                        param_key: data.param_key,
                        param_description: data.param_description,
                        param_value_date: data.param_value_date,
                        param_value_string: data.param_value_string
                    };
                }
                $mdDialog.show({
                    templateUrl: 'editor.html',
                    targetEvent: event,
                    locals: {
                        selectedItem: data,
                        oldItem: tempData,
                        dataCollection: $scope.params,
                        operation: operation
                    },
                    bindToController: true,
                    controller: ParamDetailsController,
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
        };

        //Dialog's controller
        function ParamDetailsController ($scope, $filter, $resource, $mdDialog, $mdToast, operation, selectedItem, dataCollection, paramService) {
            $scope.view = {
                dataCollection: dataCollection,
                selectedItem: selectedItem,
                operation: 'Details'
            };


            switch (operation) {
                case 'C':
                    $scope.view.operation = 'Create';
                    break;
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
            $scope.edit = edit;
            $scope.create = create;

            function back() {
                $mdDialog.cancel();
            }

            function create() {
                var sp = new paramService($scope.view.selectedItem)
                sp.$save (function() {
                    $mdDialog.hide('System parameter was successfully created.');
                });
            }

            function save() {
                if ($scope.view.selectedItem._id === undefined) create();
                else edit();
            }

            function edit() {
                var found = $filter('filter')($scope.view.dataCollection, $scope.view.selectedItem._id)
                if (found.length == 1) {
                    $scope.view.selectedItem.$update(function() {
                        $mdDialog.hide('System parameter was successfully updated.');
                    })
                } else {
                    $mdDialog.hide('Cannot modify selected system parameter.');
                }
            }
        };

})();