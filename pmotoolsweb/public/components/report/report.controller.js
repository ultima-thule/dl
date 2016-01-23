// public/js/controllers/ReportCtrl.js

angular.module('ReportCtrl', [])
.controller('ReportController', function($scope, $http, $routeParams, $location, Reports, FileSaver, Blob, Param) {

    $scope.title = "IT production reports";

    $scope.generateReport = function() {
        Reports.generate ()
        .success(function(data){
//            console.log('Generated: ' + data);
            Reports.get('/api/reports')
                        .success(function(data2) {
                            $scope.reports = data2;
                        }).error(function(data2) {
                            console.log('Error: ' + data2);
                        });
        }).error(function(data) {
            console.log('Error: ' + data);
        });
    }

    // if requested to download a file
    if ($routeParams.id)
    {
        Reports.getId($routeParams.id)
        .success(function(data){
            var blob = new Blob([data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                });
//            console.log(blob)

            var date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
            var filename = "report " + date + ".xlsx";
            FileSaver.saveAs(blob, filename);
            $location.path('/reports');
        }).error(function(data) {
            console.log('Error: ' + data);
        });

    }
    //all reports lists
    else
    {
        // when landing on the page, get all reports and show them
        var data = Param.getId('last_leankit_synchro')
        .success(function(data){
            if (data.length > 0)
                $scope.lastLeankitDate = data[0].param_value_date
        }).error(function(data) {
            console.log('Error: ' + data);
        });

        Reports.get('/api/reports')
            .success(function(data) {
                $scope.reports = data;
                console.log("report data")
//                console.log(data);
            }).error(function(data) {
                console.log('Error: ' + data);
            });
    }

});
