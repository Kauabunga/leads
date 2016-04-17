'use strict';

angular.module('bbqApp')
  .directive('bbqFeedback', function (Auth, $state, $log, $http, Util, feedback) {
    return {
      templateUrl: 'components/bbq-feedback/bbq-feedback.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {

        return init();

        function init(){
          scope.submitFeedback = submitFeedback;
          scope.resetFeedback = resetFeedback;
        }

        function submitFeedback (form, feedback, contact = 'empty', name = 'empty') {

          if(form.$valid && ! scope.submitting && feedback){

            scope.submitting = true;
            $log.debug('submitting feedback', feedback);
            return feedback.sendFeedback({feedback, contact, name})
              .then(() => {
                scope.successful = true;
                scope.feedbackSuccessTitle = 'Feedback sent!';
              })
              .catch(() => {
                //TODO only catch OFFLINE errors
                scope.successful = true;
                scope.feedbackSuccessTitle = 'Feedback will be sent next time you are online';
                return feedback.storeFeedback({feedback, contact, name});
              })
              .finally(() => {
                scope.submitting = false;
                form.registerToken.$error.feedback = true;
              });
          }
        }

        function resetFeedback (){
          scope.feedback = '';
          scope.contact = '';
          scope.name = '';
          scope.successful = false;
        }
      }
    };
  });
