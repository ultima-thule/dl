// js/services/ReportService.js
angular.module('ReportService', [])

    // super simple service
    // each function returns a promise object
    .factory('Reports', function($http) {
        return {
            get : function() {
                return $http.get('/api/reports');
            },
            getId : function(id) {
                console.log ("factory inside")
                return $http.get('/api/reports/id=' + id,
                    { responseType: 'arraybuffer',
                     headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                        }
                    });
            }
        }
    });

//angular.module('ReportService')
//.service('Reports', ['$http', function('$http') {
//
//    this.getReports = function() {
//        return $http.get('api/reports')
//    }
//
//    this.getReport = function(id) {
//        return $http.get('api/report/id=' + id)
//    }
//
//}])