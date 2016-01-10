// public/js/controllers/ReportCtrl.js

angular.module('ReportCtrl', [])
.controller('ReportController', function($scope, $http, Reports) {

    // when landing on the page, get all reports and show them
    Reports.get('/api/reports')
        .success(function(data) {
            $scope.reports = data;
            console.log("report data")
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
});

