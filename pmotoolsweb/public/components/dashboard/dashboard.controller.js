(function() {
    'use strict';


    angular
        .module('DashboardCtrl', [])
        .controller('DashboardController', DashboardController);

        DashboardController.$inject = ['$scope', '$mdBottomSheet', '$mdSidenav', '$mdDialog', '$location', '$log', '$state',
                                        'dashboardService', 'sponsorService', 'namedParamService'];

        function DashboardController($scope, $mdBottomSheet, $mdSidenav, $mdDialog, $location, $log, $state,
                                        dashboardService, sponsorService, namedParamService) {

            $scope.clickToSponsor =  function (event) {
                if (event !== undefined){
                    console.log(event[0].label)
                    $state.go('cards.bysponsor', {sponsorName: event[0].label});
                }
            }


            var data = namedParamService.getByKey('last_leankit_synchro')
            .success(function(data){
                if (data.length > 0)
                    $scope.lastLeankitDate = data[0].param_value_date
            }).error(function(data) {
                $log.$error('Error: ' + data);
            });


            dashboardService.getCardsBySponsorCnt()
                  .then( function( result ) {
                        var lookup = {};
                        var sponsors = sponsorService.query(function() {
                            for (var i = 0, len = sponsors.length; i < len; i++) {
                                lookup[sponsors[i].tag] = sponsors[i].name;
                            }
                            $scope.sponsorLabels = result.data.map(function(card) {
                                return lookup[card._id];
                            });
                            $scope.sponsorData = [result.data.map(function(card) {
                                return card.count;
                            })];
                        });
                  });

            dashboardService.getCardsByWorkflowCnt()
                  .then( function( result ) {
                         $scope.workflowLabels = result.data.map(function(work) {
                            return work._id;
                        });
                        $scope.workflowData = result.data.map(function(work) {
                            return work.count;
                        });
                        $scope.chartPieOptions = {
                            maintainAspectRatio: true,
                            tooltipEvents: [],
                            showTooltips: true,
                            tooltipCaretSize: 0,
                            onAnimationComplete: function () {
                                this.showTooltip(this.segments, true);
                            },
                            responsive: true
                        }
                        $scope.chartBarOptions = {
                            maintainAspectRatio: true,
                            responsive: true
                        }

                  });

        };
})();