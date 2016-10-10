(function() {
    'use strict';

    angular
        .module('UserProfileCtrl', [])
        .controller('UserProfileController', UserProfileController)
        .controller('DialogAvatarsController', DialogAvatarsController)
        .controller('DialogJiraBoardsController', DialogJiraBoardsController);

        UserProfileController.$inject = ['$scope', '$cookies', '$mdDialog', '$mdToast', 'userService', 'authService', 'userFactory', 'jiraboardService'];
        DialogAvatarsController.$inject = ['$scope', '$mdDialog', '$mdToast', 'userService', 'userFactory', 'oldData', 'selectedUser'];
        DialogJiraBoardsController.$inject = ['$scope', '$mdDialog', '$mdToast', 'userService', 'userFactory', 'jiraboardService', 'oldData', 'selectedUser'];

        function UserProfileController($scope, $cookies, $mdDialog, $mdToast, userService, authService, userFactory, jiraboardService) {

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
            $scope.showJiraBoards = showJiraBoards;
            $scope.addJiraBoards = addJiraBoards;
            $scope.removeJiraBoards = removeJiraBoards;
            $scope.simpleToastBase = simpleToastBase;
            $scope.showMessage = showMessage;
            $scope.boardid = "";

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

            function showJiraBoards(upn, extData, ev) {
                var tempData = {
                    upn: upn,
                    jiraBoards: extData.jiraBoards
                };

                $mdDialog.show({
                    templateUrl: 'jiraboards.html',
                    bindToController: true,
                    controller: DialogJiraBoardsController,
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

            function addJiraBoards(ev) {
                var doAdd = true;
                for (var i = 0; i < $scope.userApp.jiraBoards.length; i++) {
                    if ($scope.userApp.jiraBoards[i].boardid === $scope.boardid) {
                        doAdd = false;
                        break;
                    }
                }

                if (doAdd) {
                    jiraboardService.getBoard($scope.boardid)
                    .success(function(data){
                        if (data.type === "scrum") {
                            var board = {"boardid": data.id, "name": data.name};
                            $scope.userApp.jiraBoards.push(board);
                            $scope.userApp.$update(function() {
                                userFactory.setJiraBoards ($scope.userApp.jiraBoards);
                                showMessage('Jira board was successfully added to your boards.');
                            });
                        }
                        else {
                            showMessage('This is a kanban board, cannot be added.');
                        }
                    }).error(function(data) {
                        showMessage('An error occured while adding a board.');
                    });
                }
                else {
                    showMessage('This board already exists.');
                }
            }

            function removeJiraBoards(ev) {
                var len = $scope.userApp.jiraBoards.length;
                var arrayBoards = [];
                for (var i = 0; i < len; i++) {
                    if (!$scope.userApp.jiraBoards[i].selected) {
                        arrayBoards.push ($scope.userApp.jiraBoards[i]);
                    }
                }
                userFactory.setJiraBoards (arrayBoards);
                $scope.userApp.jiraBoards = arrayBoards;
                $scope.userApp.$update(function() {
                    showMessage('Selected Jira boards were successfully removed from your profile.');
                });
            }


            function showMessage(message) {
                simpleToastBase(message, 'bottom right', 3000, 'Close');
            }

        }

        //Dialog's avatars controller
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


        //Dialog's jira boards controller
        function DialogJiraBoardsController($scope, $mdDialog, $mdToast, userService, userFactory, jiraboardService, oldData, selectedUser) {
            $scope.oldData = oldData;
            $scope.selectedUser = selectedUser;

            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.save = function() {
                userService.get({id: $scope.oldData.upn}, function(user) {
                    user.jiraBoards = $scope.oldData.jiraBoards;
                    user.$update(function() {
                        console.log($scope.oldData.jiraBoards);
                        userFactory.setJiraBoards ($scope.oldData.jiraBoards);
                        $mdDialog.hide('Your Jira boards were successfully updated.');
                    });
                });
            };

            $scope.isLoading = true;
            jiraboardService.getAllBoards()
            .success(function(data){
                $scope.jiraBoards = data;
                $scope.isLoading = false;
            }).error(function(data) {
                showMessage('An error occured while loading boards.');
                $scope.isLoading = false;
            });
        }


})();
