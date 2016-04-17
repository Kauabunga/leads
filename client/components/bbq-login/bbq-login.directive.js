'use strict';

angular.module('bbqApp')
  .directive('bbqLogin', function (Auth, $state, $log, $timeout, toastService) {
    return {
      templateUrl: 'components/bbq-login/bbq-login.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {

        const TOKEN_TIMEOUT = 60000;


        return init();

        function init(){
          scope.submitToken = _.throttle(submitToken, 2000, true);
          scope.submitEmail = submitEmail;
          scope.resendTokenEmail = _.throttle(resendTokenEmail, 2000, true);
          scope.reset = reset;
        }

        function reset(){
          //TODO
        }

        function submitToken(form, registerToken){
          if( ! scope.email || ! registerToken || form.$invalid ){

          }
          else if(! scope.submitting) {
            scope.submitting = true;
            scope.submittingFirstToken = true;

            return Auth.login({email: scope.email, registerToken})
            .then(response => {
              $log.debug('Successfully authenticated');
              $state.go('main');
            })
            .catch(err => {
              handleErrorResponse(err);
              scope.authenticated = false;
              form.registerToken.$error.token = true;
            })
            .finally(() => {
              scope.submitting = false;
                scope.submittingFirstToken = false;
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
                $timeout(() => {
                  scope.tokenTimedout = true;
                  scope.successfulResentToken = false;
                }, TOKEN_TIMEOUT);
              })
              .catch(handleErrorResponse)
              .finally(() => {
                scope.submitting = false;
              });
          }
        }

        function resendTokenEmail(email){
          if(! scope.submitting && ! scope.successfulResentToken){
            scope.submitting = true;
            scope.submittingSecondToken = true;
            return Auth.sendTokenEmail({email})
              .then(response => {
                $log.debug('response ', response, scope.emailRegisterForm);
                scope.successfulResentToken = true;
                scope.tokenTimedout = false;
                $timeout(() => scope.tokenTimedout = true, TOKEN_TIMEOUT);
              })
              .catch(handleErrorResponse)
              .finally(() => {
                scope.submitting = false;
                scope.submittingSecondToken = false;
              });
          }
        }

        function handleErrorResponse(response){

          $log.debug('Login error response', response);

          if(response && response.status <= 0){
            toastService.errorToast('You need to be online to login');
          }
          else {
            toastService.errorToast('There was a problem trying to connect. Please try again.');
          }

        }

      }
    };
  });
