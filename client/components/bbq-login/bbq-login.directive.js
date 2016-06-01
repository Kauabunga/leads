'use strict';

angular.module('bbqApp')
  .directive('bbqLogin', function (Auth, $state, $log, $timeout, toastService, feedbackService, $localStorage, analyticsService) {
    return {
      templateUrl: 'components/bbq-login/bbq-login.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {

        const TOKEN_TIMEOUT = 60000;

        return init();

        function init(){

          scope.state = $localStorage.loginState = $localStorage.loginState || {};

          scope.submitToken = _.throttle(submitToken, 2000, true);
          scope.submitEmail = submitEmail;
          scope.resendTokenEmail = _.throttle(resendTokenEmail, 2000, true);
          scope.reset = reset;
          scope.edit = edit;

          //TODO would this be better for both the app and web platforms if it was two routes?
          //     email address should ideally not be cached in url / storage
          document.addEventListener('backbutton', onBackKeyDown, false);
          scope.$on('$destroy', () => document.removeEventListener('backbutton', onBackKeyDown));
        }

        function edit(){
          return reset();
        }

        function reset(){
          scope.state.successfulTokenSent = false;
        }

        function onBackKeyDown(e) {
          if(scope.state.successfulTokenSent){
            e.preventDefault();
            scope.state.successfulTokenSent = false;
          }
        }

        function submitToken(form, registerToken){



          if( ! scope.state.email || ! registerToken || form.$invalid ){
            form.isRegisterTokenFocused = false;
          }
          else if(! scope.submitting) {

            let email = scope.state.email;

            scope.submitting = true;
            scope.submittingFirstToken = true;

            return Auth.login({email: scope.state.email, registerToken})
            .then(response => {
              $log.debug('Successfully authenticated');

              $timeout(() => analyticsService.trackEvent('Login email success', email));
              $timeout(() => analyticsService.trackEvent('Login email with token', email));

              $timeout(() => {
                $localStorage.loginState = {};
                feedbackService.sync();
                $timeout(gotoMain);
              });
            })
            .catch(err => {
              $timeout(() => analyticsService.trackEvent('Login email failure', email));

              handleErrorResponse(err);
              scope.submitting = false;
              scope.authenticated = false;
              form.registerToken.$error.token = true;
              scope.submittingFirstToken = false;
            });
          }
        }

        function gotoMain(){
          if($localStorage.welcomeViewed){
            $timeout(() => $state.go('main', {}, {location: 'replace'}));
          }
          else {
            $timeout(() => $state.go('welcome', {}, {location: 'replace'}));
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
                $timeout(() => analyticsService.trackEvent('Login email token sent', email));
                $log.debug('response ', response, scope.emailRegisterForm);
                scope.state.successfulTokenSent = true;
                scope.state.email = email;
                $timeout(() => {
                  scope.tokenTimedout = true;
                  scope.successfulResentToken = false;
                }, TOKEN_TIMEOUT);
              })
              .catch(response => {
                $timeout(() => analyticsService.trackEvent('Login email denied', email));
                return handleErrorResponse(response);
              })
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
                $timeout(() => {
                  scope.successfulResentToken = false;
                  scope.tokenTimedout = true;
                }, TOKEN_TIMEOUT);
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
          else if(response && response.status !== 401) {
            toastService.errorToast((response.data && response.data.message) || 'Something went wrong. Please try again.');
          }

        }

      }
    };
  });
