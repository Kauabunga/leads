'use strict';

angular.module('bbqApp')
  .directive('bbqLogin', function (Auth, $state, $log, $timeout, toastService, feedbackService) {
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
          scope.edit =  edit;

          scope.emailPattern = /^(.+)@(.+)$/;

          //TODO would this be better for both the app and web platforms if it was two routes?
          //     email address should ideally not be cached in url / storage
          document.addEventListener('backbutton', onBackKeyDown, false);
          scope.$on('$destroy', () => document.removeEventListener('backbutton', onBackKeyDown));
        }

        function edit(){
          return reset();
        }

        function reset(){
          scope.successfulTokenSent = false;
        }

        function onBackKeyDown(e) {
          if(scope.successfulTokenSent){
            e.preventDefault();
            scope.successfulTokenSent = false;
          }
        }

        function submitToken(form, registerToken){
          if( ! scope.email || ! registerToken || form.$invalid ){
            form.isRegisterTokenFocused = false;
          }
          else if(! scope.submitting) {
            scope.submitting = true;
            scope.submittingFirstToken = true;

            return Auth.login({email: scope.email, registerToken})
            .then(response => {
              $log.debug('Successfully authenticated');
              $state.go('main');
              $timeout(() => {feedbackService.sync();});
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
            form.isEmailFocused = false;
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
