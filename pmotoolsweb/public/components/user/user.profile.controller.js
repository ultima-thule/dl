(function() {
    'use strict';

    angular
        .module('UserProfileCtrl', [])
        .controller('UserProfileController', UserProfileController);

        UserProfileController.$inject = ['$scope', '$cookies', '$mdDialog', '$mdToast', 'userService', 'authService', 'userFactory'];

        function UserProfileController($scope, $cookies, $mdDialog, $mdToast, userService, authService, userFactory) {

            authService.getMe()
            .success(function(data){
                $scope.user = data;
                userService.get({id: $scope.user.info.upn}, function(user) {
                    $scope.userApp = user;
                });
            }).error(function(data) {
                console.log('Error: ' + data);
            });

            $scope.$watch(function () { return userFactory.getAvatar(); }, function (newValue, oldValue) {
                $scope.avatar = newValue;
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

            function showAvatars(upn, extData, ev) {
                var tempData = {
                    upn: upn,
                    avatar: extData.avatar
                };

                $mdDialog.show({
                    templateUrl: 'avatars.html',
                    bindToController: true,
                    controller: DialogAvatarsController,
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    locals: {
                        oldData: tempData,
                        selectedUser: extData
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
        function DialogAvatarsController($scope, $mdDialog, $mdToast, userService, userFactory, oldData, selectedUser) {
            $scope.avatars = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10',
                            '11', '12', '13', '14', '15', '16', '17', '18', '19', '20']

            $scope.oldData = oldData;
            $scope.selectedUser = selectedUser;

            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.save = function() {
                userService.get({id: $scope.oldData.upn}, function(user) {
                    user.avatar = $scope.oldData.avatar;
                    user.$update(function() {
                        console.log($scope.oldData.avatar);
                        userFactory.setAvatar ($scope.oldData.avatar);
                        $mdDialog.hide('Your avatar was successfully updated.');
                    });
                });
            };
        }

})();
