// public/js/controllers/CardCtrl.js

angular.module('CardCtrl', [])
.controller('CardController', function($scope, $http, $mdDialog, $mdToast, Cards) {

    $scope.formData = {};

    $scope.title = "Initiatives in production";

    $scope.query = {
        limit: '10',
        page: 1
    };

    $scope.showDialog = showDialog;


    $scope.cards = Cards.query(function() {
        //console.log(entries);
    });

    function showDialog(operation, data, event) {
//        console.log(data);
//        var tempData = undefined;
//        if (data === undefined) {
//            tempData = {};
//        } else {
//            tempData = {
//                id: data._id,
//                name: data.name,
//                location: data.location,
//                category: data.default_category,
//                sponsor: data.sponsor_name
//            };
//        }
        $mdDialog.show({
            templateUrl: 'editor.html',
            targetEvent: event,
            locals: {
                selectedItem: data,
                dataCollection: $scope.cards,
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
//        $scope.save = save;
//        $scope.remove = remove;

        $scope.sponsors = Sponsors.query(function() {
        });

        function back() {
            $mdDialog.cancel();
        }

        function save() {
            if ($scope.view.selectedItem.id === undefined) create();
            else edit();
        }

        function edit() {
            var found = $filter('filter')($scope.view.dataCollection, $scope.view.selectedItem.id)
            if (found.length == 1) {
//                found[0].name = $scope.view.selectedItem.name
//                found[0].location = $scope.view.selectedItem.location
//                found[0].default_category = $scope.view.selectedItem.category
//                found[0].sponsor_name = $scope.view.selectedItem.sponsor
                $mdDialog.hide('Initiative was successfully updated.');
            } else {
                $mdDialog.hide('Cannot modify selected initiative.');
            }
        }
    }

});
