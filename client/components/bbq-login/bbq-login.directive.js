'use strict';

angular.module('bbqApp')
  .directive('bbqLogin', function (Auth, $state, $log) {
    return {
      templateUrl: 'components/bbq-login/bbq-login.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {

        return init();

        function init(){
          scope.submitToken = submitToken;
          scope.submitEmail = submitEmail;
        }

        function submitToken(form, registerToken){
          if( ! scope.email || ! registerToken || form.$invalid ){

          }
          else if(! scope.submitting) {
            scope.submitting = true;

            return Auth.login({email: scope.email, registerToken})
            .then(response => {
              $log.debug('Successfully authenticated');
              $state.go('main');
            })
            .catch(err => {
              scope.authenticated = false;
              form.registerToken.$error.token = true;
            })
            .finally(() => {
              scope.submitting = false;
            });
          }
        }

        function submitEmail(form, email){

          if( ! email || form.$invalid ){

          }
          else if(! scope.submitting ){
            scope.submitting = true;
            return Auth.sendTokenEmail({email})
              .then(response => {
                $log.debug('response ', response, scope.emailRegisterForm);
                scope.successfulTokenSent = true;
                scope.email = email;
              })
              .finally(() => {
                scope.submitting = false;
              });
          }
        }

      }
    };
  });
