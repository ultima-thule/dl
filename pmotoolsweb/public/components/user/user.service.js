// js/services/UserService.js
(function() {
    'use strict';

    angular
        .module('UserService', [])
        .factory('userService', userService)
        .factory('userFactory', userFactory);

        function userService($resource) {
            return $resource('/api/users/:id', { id: '@_id' }, {
                update: {method: 'PUT'},
                query: {method: 'GET', isArray: true},
                get: {method: 'GET'},
            });
        };

        function userFactory () {

            var data = {
                signedIn: false,
                displayName: '',
                avatar: '0'
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
                isSignedIn: function () {
                    return data.signedIn;
                },
                signIn: function () {
                    data.signedIn = true;
                },
                signOff: function () {
                    data.signedIn = false;
                    data.displayName = '';
                    data.avatar = '0';
                }
            };
        };

})();
