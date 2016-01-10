// public/js/controllers/ReportCtrl.js

angular.module('ReportCtrl', [])
.controller('ReportController', function($scope, $http, $routeParams, Reports, FileSaver, Blob) {

    console.log("Route param id: " + $routeParams.id);
    if ($routeParams.id)
    {
        Reports.getId($routeParams.id)
//        $http.get({
//            url: '/api/reports/id=' + $routeParams.id,
//            responseType: 'arraybuffer',
//            headers: {
//                'Content-type': 'application/json',
//                'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//            }
        // })
        .success(function(data){
            var blob = new Blob([data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                });
            console.log(blob)
            FileSaver.saveAs(blob, 'text.xlsx');

            }).error(function(){
            //Some error log
        });
//        Reports.getId('/api/reports/:id', $routeParams.id)
//            .success(function(data, status, headers) {
//                console.log("report detailed data")
//                console.log(data);
//
//                console.log(headers)
//
//            })
//            .error(function(data) {
//                console.log('Error: ' + data);
//            });
    }
    else
    {
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
    }

});
