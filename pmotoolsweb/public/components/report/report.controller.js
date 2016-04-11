// public/js/controllers/ReportCtrl.js

(function() {
    'use strict';

    angular
        .module('ReportCtrl', [])
        .controller('ReportController', ReportController);

        ReportController.$inject = ['$scope', '$http', '$routeParams', '$location', 'reportService', 'FileSaver', 'Blob', 'namedParamService'];

        function ReportController($scope, $http, $routeParams, $location, reportService, FileSaver, Blob, namedParamService) {

            $scope.title = "IT production reports";

            $scope.refreshReports = function (){
                //show progress bar
                $scope.isLoading = true;
                reportService.get("1")
                    .success(function(data) {
                        $scope.reports1 = data;
                    });

                reportService.get("2")
                    .success(function(data) {
                        $scope.reports2 = data;
                    });

                reportService.get("3")
                    .success(function(data) {
                        $scope.reports3 = data;
                    })
                    .finally(function() {
                        $scope.isLoading = false;
                    });
            }

            $scope.generateReport = function(format_nr) {
                $scope.isLoading = true;
                reportService.generate (format_nr)
                .success(function(data){
                    $scope.refreshReports ();
                })
                .error(function(data) {
                    $scope.isLoading = false;
                });
            }

            // if requested to download a file
            if ($routeParams.id)
            {
                reportService.getId($routeParams.id)
                .success(function(data){
                    var blob = new Blob([data], {
                        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                        });

                    var date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
                    var filename = "report " + date + ".xlsx";
                    FileSaver.saveAs(blob, filename);
                    $location.path('/reports');
                }).error(function(data) {
                });

            }
            //all reports lists
            else
            {
                // when landing on the page, get all reports and show them
                var data = namedParamService.getByKey('last_leankit_synchro')
                .success(function(data){
                    if (data.length > 0)
                        $scope.lastLeankitDate = data[0].param_value_date
                });

                $scope.refreshReports ();

            }
        };

})();