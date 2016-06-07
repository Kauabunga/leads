'use strict';

angular.module('bbqApp')
  .service('toastService', function ($mdToast, $log) {


    this.updateToast = () => {
      $log.debug('Update toast');
      return this.showActionToast({
        content: 'We\'ve enhanced the Leads experience',
        action: 'Update now'
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
      return $mdToast.show(
        $mdToast.simple()
          .textContent(content)
          .action(action)
          .position('bottom right')
          .hideDelay(false)
      );
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
