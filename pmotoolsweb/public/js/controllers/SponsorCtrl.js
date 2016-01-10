// public/js/controllers/SponsorCtrl.js

angular.module('SponsorCtrl', [])
.config(function($mdIconProvider) {
  $mdIconProvider
    .iconSet('communication', 'img/icons/sets/communication-icons.svg', 24);
})
.controller('SponsorController', function($scope) {
    var imagePath = 'img/list/60.jpeg';

    $scope.phones = [
      { type: 'Home', number: '(555) 251-1234' },
      { type: 'Cell', number: '(555) 786-9841' },
      { type: 'Office', number: '(555) 314-1592' }
    ];
    $scope.sponsors = [
      {
        face : 'face',
        name: 'Sponsor 1',
        bo_name: 'Jan Kowalski',
        teams: ['Team A', 'Team B']
      },
      {
        face : 'face',
        name: 'Sponsor 2',
        bo_name: 'Jan Kowalski',
        teams: ['Team C', 'Team D']
      },
      {
        face : 'face',
        name: 'Sponsor 3',
        bo_name: 'Jan Kowalski',
        teams: ['Team E', 'Team F']
      },
      {
        face : 'face',
        name: 'Sponsor 4',
        bo_name: 'Jan Kowalski',
        teams: ['Team G', 'Team H']
      },
      {
        face : 'face',
        name: 'Sponsor 5',
        bo_name: 'Jan Kowalski',
        teams: ['Team I', 'Team J']
      },
    ];
});

