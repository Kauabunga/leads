'use strict';

angular.module('bbqApp')
  .directive('bbqFeedback', function (Auth, $state, $log, $http, Util, feedbackService) {
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

          if(form.$invalid){
            form.isFeedbackFocused = false;
          }
          else if(form.$valid && ! scope.submitting && feedback){

            scope.submitting = true;
            let feedbackObject = {feedback, contact, name};
            $log.debug('submitting feedback', feedback);

            //return feedbackService.sendFeedback(feedbackObject)
            return feedbackService.encryptAndSendFeedback(feedbackObject)
              .then(() => {
                scope.successful = true;
                scope.feedbackSuccessTitle = 'Your feedback has been sent.';
              })
              .catch((response) => {

                // Only catch OFFLINE errors
                if(response && response.status <= 0){
                  scope.successful = true;
                  scope.feedbackSuccessTitle = 'Your feedback will be sent next time you are online.';
                  return feedbackService.storeFeedback(feedbackObject);
                }
                else {
                  form.registerToken.$error.feedback = true;
                }

              })
              .finally(() => {
                scope.submitting = false;
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
