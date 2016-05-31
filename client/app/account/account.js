'use strict';

angular.module('bbqApp')
  .config(function($stateProvider) {

    $stateProvider
      .state('login', {
        url: '/login',
        template: '<bbq-login></bbq-login>'
      })
      .state('token', {
        url: '/token/:email/:token',
        template: '<div></div>',
        controller: function($state, $stateParams, $log, Auth, $timeout, $localStorage, feedbackService){
          Auth.login({email: $stateParams.email, registerToken: $stateParams.token})
            .then(response => {
              $log.debug('Successfully authenticated');

              $timeout(() => {
                $localStorage.loginState = {};
                feedbackService.sync();
                $timeout(() => $state.go('main', {}, {location: 'replace'}));
              });
            });
        }
      })
      .state('logout', {
        url: '/logout?referrer',
        referrer: 'main',
        template: '',
        controller: function($state, Auth) {
          var referrer = $state.params.referrer ||
                          $state.current.referrer ||
                          'main';
          Auth.logout();
          $state.go(referrer);
        }
      })
      .state('admin', {
        url: '/admin',
        template: '<bbq-admin></bbq-admin>',
        authenticate: 'admin'
      });
  })
  .run(function($rootScope) {
    $rootScope.$on('$stateChangeStart', function(event, next, nextParams, current) {
      if (next.name === 'logout' && current && current.name && !current.authenticate) {
        next.referrer = current.name;
      }
    });
  });
