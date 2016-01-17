// public/js/controllers/SponsorCtrl.js

angular.module('SponsorCtrl', [])
.controller('SponsorController', function($scope, $http, $mdDialog, $mdToast, Sponsors) {

    $scope.title = "Sponsors configuration";

    $scope.showDialog = showDialog;

    $scope.query = {
        limit: '10',
        page: 1
    };

    $scope.sponsors = Sponsors.query(function() {
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
//        console.log(data);
        var tempData = undefined;
        if (data === undefined) {
            tempData = {};
        } else {
            tempData = {
                id: data._id,
                name: data.name,
                bo_name: data.bo_name,
                tag: data.tag
            };
        }
        $mdDialog.show({
            templateUrl: 'editor.html',
            targetEvent: event,
            locals: {
                selectedItem: data,
                dataCollection: $scope.sponsors,
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
    function DialogController($scope, $filter, $mdDialog, $mdToast, operation, selectedItem, dataCollection, Sponsors) {
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
        $scope.remove = remove;

        function back() {
            $mdDialog.cancel();
        }

        function save() {
            if ($scope.view.selectedItem._id === undefined) create();
            else edit();
        }

        function create() {
            var sp = new Sponsors($scope.view.selectedItem)
            sp.$save (function() {
                $mdDialog.hide('Sponsor was successfully created.');
            });
        }

        function edit() {
            var found = $filter('filter')($scope.view.dataCollection, $scope.view.selectedItem._id)
            if (found.length == 1) {
                $scope.view.selectedItem.$update(function() {
                    $mdDialog.hide('Sponsor was successfully updated.');
                })
            } else {
                $mdDialog.hide('Cannot modify selected sponsor.');
            }
        }

        function remove() {
            var found = $filter('filter')($scope.view.dataCollection, $scope.view.selectedItem._id)
            if (found.length == 1) {
                $scope.view.selectedItem.$remove(function() {
                    $mdDialog.hide('Sponsor was removed.');
                })
            } else {
                $mdDialog.hide('Cannot remove selected sponsor.');
            }
        }
    }


});

