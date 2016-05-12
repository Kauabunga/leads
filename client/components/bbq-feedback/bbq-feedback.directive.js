'use strict';

angular.module('bbqApp')
  .directive('bbqFeedback', function (Auth, $state, $log, $http, Util, feedbackService, $localStorage) {
    return {
      templateUrl: 'components/bbq-feedback/bbq-feedback.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {

        return init();

        function init(){

          //TODO we want to ensure that this is not too old - i.e. from a week ago
          scope.state = $localStorage.feedbackState = $localStorage.feedbackState || {};

          scope.submitFeedback = submitFeedback;
          scope.resetFeedback = resetFeedback;
        }

        function submitFeedback (form, feedbackObject) {

          if(form.$invalid){
            form.isFeedbackFocused = false;
          }
          else if(form.$valid && ! scope.submitting && feedbackObject){

            scope.submitting = true;
            $log.debug('submitting feedback', feedbackObject);

            //return feedbackService.sendFeedback(feedbackObject)
            return feedbackService.encryptAndSendFeedback(feedbackObject)
              .then(() => {
                scope.successful = true;
                scope.feedbackSuccessTitle = 'Your lead has been sent.';

                scope.state = $localStorage.feedbackState = {};

              })
              .catch((response) => {

                // Only catch OFFLINE errors
                if(response && response.status <= 0){
                  scope.successful = true;
                  scope.feedbackSuccessTitle = 'Your lead will be sent next time you are online.';
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
          scope.state = $localStorage.feedbackState = {};

          scope.successful = false;
        }
      }
    };
  });
