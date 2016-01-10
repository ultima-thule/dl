// public/js/controllers/TeamCtrl.js

angular.module('TeamCtrl', [])
.controller('TeamController', function($scope, $http, Teams) {

    $scope.formData = {};

    $scope.title = "Teams configuration";

    $scope.categories = ('IT Platforms;Business').split(';').map(function(category) {
            return {name: category};
    });

    $scope.locations = ('Kraków;Warszawa;Wrocław').split(';').map(function(location) {
            return {name: location};
    });

    $scope.pmos = ('PMO Asia;PMO Sławek').split(';').map(function(pmo) {
            return {name: pmo};
    });


    // when landing on the page, get all teams and show them
    Teams.get('/api/teams')
        .success(function(data) {
            $scope.teams = data;
            console.log("dane teamów")
            console.log(data);
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

    function mostrarDialogo(operation, data, event) {
        var tempData = undefined;
        if (data === undefined) {
            tempData = {};
        } else {
            tempData = {
                id: data.id,
                name: data.name,
                lastname: data.lastname,
                email: data.email,
                direction: data.direction

            };
        }
        $mdDialog.show({
            templateUrl: 'editor.html',
            targetEvent: event,
            locals: {
                selectedItem: tempData,
                dataTable: $scope.view.dataTable,
                operation: operation
            },
            bindToController: true,
            controller: DialogController,
            parent: angular.element(document.body)
        })
        .then(
            function (result) {
                // mostrarError(result);
            }
        );
    }

});

