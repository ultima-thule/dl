// js/services/jiraboard.service.js
(function() {
    'use strict';

    angular
        .module('JiraboardService', [])
        .factory('jiraboardService', jiraboardService);

        function jiraboardService($http) {
            return {
                getAllBoards : function() {
                    return $http.get('/api/jira/boards');
                },
                getBoard : function(boardID) {
                    return $http.get('/api/jira/boards/' + boardID);
                },
                getSprints : function(boardID) {
                    return $http.get('/api/jira/boards/' + boardID + '/sprint');
                }
            }
        };

})();

