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

        function submitFeedback (form, feedback) {
          if(form.$valid && ! scope.submitting){
            scope.submitting = true;
            $log.debug('submitting feedback', feedback);
            return $http.post('/api/feedbacks', feedback)
              .then(() => {
                scope.successful = true;
              })
              .finally(() => {
                scope.submitting = false;
              });
          }

        }


        function resetFeedback (){
          scope.feedback = {};
          scope.successful = false;
        }
      }
    };
  });
