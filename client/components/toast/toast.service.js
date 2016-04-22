'use strict';

angular.module('bbqApp')
  .service('toastService', function ($mdToast, $log) {

    this.updateToast = () => {
      $log.debug('Update toast');
      return this.showActionToast({
        content: 'An update is ready',
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

    this.showActionToast = ({content, action, position}  = {position: 'bottom right'}) => {

      console.log(position)
      console.log(position)
      console.log(position)
      console.log(position)

      var toast = $mdToast.simple()
        .textContent(content)
        .action(action)
        //.highlightAction(true)
        //.highlightClass('md-accent')
        .position(position)
        .hideDelay(false);
      return $mdToast.show(toast);
    };

    this.showSimpleToast = ({message, position} = {position: 'bottom right'}) => {
      return $mdToast.show(
        $mdToast.simple()
          .textContent(message)
          .position(position)
          .hideDelay(8000)
      );
    };

  });
