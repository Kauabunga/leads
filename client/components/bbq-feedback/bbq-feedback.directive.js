'use strict';

angular.module('bbqApp')
  .directive('bbqFeedback', function (Auth, $state, $log, $http, Util) {
    return {
      templateUrl: 'components/bbq-feedback/bbq-feedback.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {

        const FEEDBACK_API = `${Util.getBaseApiUrl()}api/feedbacks`;


        return init();

        function init(){
          scope.submitFeedback = submitFeedback;
          scope.resetFeedback = resetFeedback;
        }

        function submitFeedback (form, feedback, contact = 'empty', name = 'empty') {

          if(form.$valid && ! scope.submitting && feedback){

            scope.submitting = true;
            $log.debug('submitting feedback', feedback);
            return $http.post(FEEDBACK_API, {feedback, contact, name})
              .then(() => {
                scope.successful = true;
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
