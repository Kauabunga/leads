'use strict';

angular.module('bbqApp')
  .service('modalService', function ($http, $log, $q, $timeout, $mdDialog) {

    this.isModalActive = false;

    this.confirmLogoutModal = $event => {
      return this.showConfirmModal($event, 'Are you sure you want to logout?', 'Yes, logout', 'No, take me back');
    };

    this.confirmRefreshModal = $event => {
      return this.showConfirmModal($event, 'You will lose any feedback already entered', 'Refresh', 'Cancel');
    };

    this.showConfirmModal = ($event, message, yes, no) => {
      if ( ! this.isModalActive) {
        var confirm = $mdDialog.confirm()
          .title(message || 'Are you sure?')
          //.targetEvent($event)
          .openFrom({
            top: -200,
            width: getWindowWidth(),
            height: 80
          })
          .closeTo({
            top: -100,
            width: getWindowWidth(),
            height: 80
          })
          .clickOutsideToClose(true)
          .ok(yes || 'Yes')
          .cancel(no || 'No');
        return $mdDialog.show(confirm);
      }
      else {
        $log.debug('Modal already active');
        return $q.reject(new Error('Modal already active'));
      }
    };

    function getWindowWidth(){
      return window.innerWidth
      || document.documentElement.clientWidth
      || document.body.clientWidth;
    }

  });
