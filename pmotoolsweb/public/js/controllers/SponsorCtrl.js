// public/js/controllers/SponsorCtrl.js

angular.module('SponsorCtrl', [])
.controller('SponsorController', function($scope, $http, $mdDialog, $mdToast, Sponsors) {

    $scope.title = "Sponsors configuration";

    $scope.showDialog = showDialog;

    // when landing on the page, get all sponsors and show them
    Sponsors.get('/api/sponsors')
        .success(function(data) {
            $scope.sponsors = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
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
                id: data._id,
                name: data.name,
                bo_name: data.bo_name
            };
        }
        $mdDialog.show({
            templateUrl: 'editor.html',
            targetEvent: event,
            locals: {
                selectedItem: tempData,
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
    function DialogController($scope, $filter, $mdDialog, $mdToast, operation, selectedItem, dataCollection) {
        $scope.view = {
            dataCollection: dataCollection,
            selectedItem: selectedItem,
            operation: 'Create'
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
            if ($scope.view.selectedItem.id === undefined) create();
            else edit();
        }

        //Permite agregar un nuevo elemento
        function create() {
            //Determinando si existe el elemento con el ID especificado
            var temp = _.find($scope.view.dataCollection, function (x) { return x.id === $scope.view.selectedItem.id; });
            if (temp === undefined) {
                //Generando ID para el nuevo elemento
                $scope.view.selectedItem.id = generateUUID();
                $scope.view.dataCollection.push($scope.view.selectedItem);
                $mdDialog.hide('Datos agregados con éxito');
            } else {
                $mdDialog.hide('Ya están registrados los datos de la persona indicada');
            }
        }

        function edit() {
            var found = $filter('filter')($scope.view.dataCollection, $scope.view.selectedItem.id)
            if (found.length == 1) {
                found[0].name = $scope.view.selectedItem.name
                found[0].bo_name = $scope.view.selectedItem.bo_name
                $mdDialog.hide('Sponsor was successfully updated.');
            } else {
                $mdDialog.hide('Cannot modify selected sponsor.');
            }
        }

        function remove() {
            var found = $filter('filter')($scope.view.dataCollection, $scope.view.selectedItem.id)
            if (found.length == 1) {
                $mdDialog.hide('Sponsor was removed.');
            } else {
                    $mdDialog.hide('Cannot remove selected sponsor.');
            }
        }
    }


});

