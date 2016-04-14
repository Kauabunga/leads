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

        function submitToken(form, user = {}){
          if( ! user.email || ! user.registerToken || form.$invalid ){

          }
          else {
            return Auth.login(user)
              .then(response => {
                $log.debug('Successfully authenticated');
                $state.go('main');
              })
              .catch(err => {
                scope.authenticated = false;
              });
          }
        }

        function submitEmail(form, user = {}){
          if( ! user.email || form.$invalid ){

          }
          else {
            return Auth.sendTokenEmail(user)
              .then(response => {
                $log.debug('response ', response, scope.emailRegisterForm);
                scope.emailSent = true;
              });
          }
        }
      }
    };
  });
