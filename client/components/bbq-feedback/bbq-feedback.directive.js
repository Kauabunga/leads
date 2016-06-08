'use strict';

angular.module('bbqApp')
  .directive('bbqFeedback', function (Auth, $state, $log, $http, Util, feedbackService, $localStorage, toastService) {
    return {
      templateUrl: 'components/bbq-feedback/bbq-feedback.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {

        let leadSentText = 'Your lead has been passed on to our sales team.';

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
                scope.feedbackSuccessTitle = leadSentText;

                scope.state = $localStorage.feedbackState = {};

              })
              .catch((response) => {

                // Only catch OFFLINE errors
                if(response && response.status <= 0){
                  scope.successful = true;
                  scope.feedbackSuccessTitle = 'Your lead will be sent next time you are online.';
                  return feedbackService.storeFeedback(feedbackObject);
                }
                else if(response.status === 401){
                  toastService.errorToast('You need to be logged in to submit your lead');
                }
                else {
                  toastService.errorToast('Uh oh, something went wrong trying to submit your lead. Please try again shortly.');
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
