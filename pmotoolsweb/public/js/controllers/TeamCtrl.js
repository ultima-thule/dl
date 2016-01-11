// public/js/controllers/TeamCtrl.js

angular.module('TeamCtrl', [])
.controller('TeamController', function($scope, $http, $mdDialog, $mdToast, Teams) {

    $scope.formData = {};

    $scope.title = "Teams configuration";

    $scope.showDialog = showDialog;

    // when landing on the page, get all teams and show them
    Teams.get('/api/teams')
        .success(function(data) {
            $scope.teams = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // when submitting the add form, send the text to the node API
    $scope.createTeam = function() {
        $http.post('/api/teams', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.teams = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

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
                location: data.location,
                category: data.default_category,
                sponsor: data.sponsor_name
            };
        }
        $mdDialog.show({
            templateUrl: 'editor.html',
            targetEvent: event,
            locals: {
                selectedItem: tempData,
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
    function DialogController($scope, $filter, $mdDialog, $mdToast, operation, selectedItem, dataCollection) {
        $scope.view = {
            dataCollection: dataCollection,
            selectedItem: selectedItem,
            operation: 'Create'
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
                found[0].location = $scope.view.selectedItem.location
                found[0].default_category = $scope.view.selectedItem.category
                found[0].sponsor_name = $scope.view.selectedItem.sponsor
                $mdDialog.hide('Team was successfully updated.');
            } else {
                $mdDialog.hide('Cannot modify selected team.');
            }
        }

        function remove() {
            var found = $filter('filter')($scope.view.dataCollection, $scope.view.selectedItem.id)
            if (found.length == 1) {
                $mdDialog.hide('Team was removed.');
            } else {
                    $mdDialog.hide('Cannot remove selected team.');
            }
        }
    }

});