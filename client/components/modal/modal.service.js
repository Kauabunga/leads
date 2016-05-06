'use strict';

angular.module('bbqApp')
  .service('modalService', function ($http, $log, $q, $timeout, $localStorage, Util, toastService, $interval) {

    this.isModalActive = false;

    this.confirmLogoutModal = $event => {
      return this.showConfirmModal($event, 'Are you sure?', 'Yes, logout', 'No, take me back');
    };

    this.confirmRefreshModal = $event => {
      return this.showConfirmModal($event, 'You will lose any feedback already entered', 'Refresh', 'Cancel');
    };

    this.showConfirmModal = ($event, message, yes, no) => {

      if ( ! this.isModalActive) {
        var confirm = $mdDialog.confirm()
          .title('Would you like to delete your debt?')
          .targetEvent($event)
          .ok('Please do it!')
          .cancel('Sounds like a scam');
        return $mdDialog.show(confirm);
      }
      else {
        $log.debug('Modal already active');
        return $q.reject(new Error('Modal already active'));
      }

      //  .then(function() {
      //  $scope.status = 'You decided to get rid of your debt.';
      //}, function() {
      //  $scope.status = 'You decided to keep your debt.';
      //});


    };


  });
