// js/services/UserService.js
(function() {
    'use strict';

    angular
        .module('UserService', [])
        .factory('userService', userService)
        .factory('userLKService', userLKService)
        .factory('userFactory', userFactory);

        function userService($resource) {
            return $resource('/api/users/:id', { id: '@_id' }, {
                update: {method: 'PUT'},
                query: {method: 'GET', isArray: true},
                get: {method: 'GET'},
            });
        };

        function userLKService($resource) {
            return $resource('/api/usersLeankit/:id', { id: '@_id' }, {
                update: {method: 'PUT'},
                query: {method: 'GET', isArray: true},
                get: {method: 'GET'},
            });
        };

        function userFactory () {

            var data = {
                signedIn: false,
                displayName: '',
                avatar: '01',
                isAdmin: false,
                jiraBoards: []
            };

            return {
                getDisplayName: function () {
                    return data.displayName;
                },
                setDisplayName: function (name) {
                    data.displayName = name;
                },
                getAvatar: function () {
                    return data.avatar;
                },
                setAvatar: function (name) {
                    data.avatar = name;
                },
                getAdmin: function () {
                    return data.isAdmin;
                },
                setAdmin: function (isAdmin) {
                    data.isAdmin = isAdmin;
                },
                getJiraBoards: function () {
                    return data.jiraBoards;
                },
                setJiraBoards: function (jiraBoards) {
                    data.jiraBoards = jiraBoards;
                },
                isSignedIn: function () {
                    return data.signedIn;
                },
                signIn: function () {
                    data.signedIn = true;
                },
                signOff: function () {
                    data.signedIn = false;
                    data.displayName = '';
                    data.avatar = '01';
                    data.isAdmin = false;
                    data.jiraBoards = [];
                }
            };
        };

})();
