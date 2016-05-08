'use strict';

angular.module('bbqApp')
  .service('modalService', function ($http, $log, $q, $timeout, $mdDialog) {

    this.isModalActive = false;

    this.confirmLogoutModal = $event => {
      return this.showConfirmModal($event, 'Are you sure? You will need to login again', 'Yes, logout', 'No, take me back');
    };

    this.confirmRefreshModal = $event => {
      return this.showConfirmModal($event, 'You will lose any feedback already entered', 'Okay, reset', 'No! Cancel');
    };

    this.showConfirmModal = ($event, message, yes, no) => {
      if ( ! this.isModalActive) {
        var confirm = $mdDialog.confirm()
          .title(message || 'Are you sure?')
          //.targetEvent($event)
          .openFrom({
            top: -250,
            width: getWindowWidth(),
            height: 150
          })
          .closeTo({
            top: -150,
            width: getWindowWidth(),
            height: 150
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
