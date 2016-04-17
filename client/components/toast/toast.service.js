'use strict';

angular.module('bbqApp')
  .service('toastService', function ($mdToast, $log) {

    this.updateToast = () => {
      $log.debug('Update toast');
      return this.showActionToast({
        content: 'An update is ready',
        action: 'Refresh'
      })
        .then(response => {
          if(response === 'ok'){
            window.location.reload();
          }
        });
    };


    this.errorToast = (errorMessage) => {
      return this.showSimpleToast({
        message: errorMessage
      });
    };

    this.toast = (message) => {
      return this.showSimpleToast({message});
    };

    this.showActionToast = ({content, action}) => {

      var toast = $mdToast.simple()
        .textContent(content)
        .action(action)
        //.highlightAction(true)
        //.highlightClass('md-accent')
        .position('bottom right')
        .hideDelay(false);
      return $mdToast.show(toast);
    };

    this.showSimpleToast = ({message}) => {
      return $mdToast.show(
        $mdToast.simple()
          .textContent(message)
          .position('bottom right')
          .hideDelay(8000)
      );
    };

  });
