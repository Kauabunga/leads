'use strict';

angular.module('bbqApp')
  .service('modalService', function ($http, $log, $q, $timeout, $mdDialog) {

    this.isModalActive = false;
    let ua = navigator.userAgent.toLowerCase();
    let isAndroid = ua.indexOf("android") > -1;


    this.confirmLogoutModal = $event => {
      return this.showConfirmModal($event, 'Are you sure? You will need to login again', 'Yes, logout', 'No, take me back');
    };

    this.confirmRefreshModal = $event => {
      return this.showConfirmModal($event, 'You will lose any information already entered', 'Ok, reset', 'No! Cancel');
    };

    this.showConfirmModal = ($event, message, yes, no) => {
      if ( ! this.isModalActive) {
        this.isModalActive = true;
        return $mdDialog.show($mdDialog.confirm()
            .title(message || 'Are you sure?')
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
            .cancel(no || 'No'))
          .finally(() => this.isModalActive = false);
      }
      else {
        $log.debug('Modal already active');
        return $q.reject(new Error('Modal already active'));
      }
    };

    this.showAddToHomescreenModel = ($event) => {
      return this.showInfoModel($event, 'components/modal/addToHomescreenModal.html');
    };

    this.showUseSpeechToTextModel = ($event) => {
      return this.showInfoModel($event, 'components/modal/useSpeechToTextModal.html');
    };


    this.showInfoModel = ($event, templateUrl) => {
      if ( ! this.isModalActive) {
        this.isModalActive = true;
        return $mdDialog.show({
            controller: ['$scope', '$mdDialog', ($scope, $mdDialog) => {
              $scope.isIOS = ! isAndroid;
              $scope.isAndroid = isAndroid;
              $scope.hideModal = $mdDialog.hide;
              $scope.maxImgHeight = getWindowHeight() * getWindowHeightMultiplier();
              let onResize = () => $scope.maxImgHeight = getWindowHeight() * getWindowHeightMultiplier();
              window.addEventListener('resize', onResize);
              $scope.$on('$destroy', () => window.removeEventListener('resize', onResize));
            }],
            templateUrl: templateUrl,
            parent: angular.element(document.body),
            targetEvent: $event,
            clickOutsideToClose: true,

            fullscreen: false
          })
          .finally(() => this.isModalActive = false);
      }
    };

    function getWindowHeightMultiplier() {
      return isAndroid ? 0.8 : 0.8;
    }

    function getWindowWidth(){
      return window.innerWidth
      || document.documentElement.clientWidth
      || document.body.clientWidth;
    }

    function getWindowHeight(){
      return window.innerHeight
      || document.documentElement.clientHeight
      || document.body.clientHeight;
    }

  });
