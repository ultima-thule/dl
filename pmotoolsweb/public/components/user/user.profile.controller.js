(function() {
    'use strict';

    angular
        .module('UserProfileCtrl', [])
        .controller('UserProfileController', UserProfileController);

        UserProfileController.$inject = ['$scope', '$cookies', '$mdDialog', '$mdToast', 'userService', 'authService'];

        function UserProfileController($scope, $cookies, $mdDialog, $mdToast, userService, authService) {

            authService.getMe()
            .success(function(data){
                $scope.user = data;
                userService.get({id: $scope.user.info.upn}, function(user) {
                    $scope.userApp = user;
                });
            }).error(function(data) {
                console.log('Error: ' + data);
            });

            $scope.showAvatars = showAvatars;
            $scope.simpleToastBase = simpleToastBase;
            $scope.showMessage = showMessage;

            function simpleToastBase(message, position, delay, action) {
                $mdToast.show(
                    $mdToast.simple()
                        .content(message)
                        .position(position)
                        .hideDelay(delay)
                        .action(action)
                );
            }

            function showAvatars(data, ev) {
                $mdDialog.show({
                    templateUrl: 'avatars.html',
                    bindToController: true,
                    controller: DialogAvatarsController,
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    locals: {
                        selectedItem: data,
                    }
                })
                .then(
                    function (result) {
                        showMessage(result);
                    }
                );
            }

            function showMessage(message) {
                simpleToastBase(message, 'bottom right', 3000, 'Close');
            }

        }

        //Dialog's controller
        function DialogAvatarsController($scope, $mdDialog, $mdToast, selectedItem) {
            $scope.avatars = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10',
                            '11', '12', '13', '14', '15', '16', '17', '18', '19', '20']

            $scope.selectedUser = selectedItem;
            console.log(selectedItem);

            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.save = function() {
                $scope.selectedUser.$update(function() {
                    $mdDialog.hide('Your avatar was successfully updated.');
                })
            };
        }

})();
