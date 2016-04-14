'use strict';

angular.module('bbqApp')
  .directive('bbqFeedback', function (Auth, $state, $log, $http) {
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
            return $http.post('/api/feedbacks', {feedback, contact, name})
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
