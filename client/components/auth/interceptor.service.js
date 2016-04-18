'use strict';

(function() {

function authInterceptor($rootScope, $q, $localStorage, $injector, Util, $log) {
  var state;
  return {
    // Add authorization token to headers
    request(config) {
      config.headers = config.headers || {};

      let token = $localStorage.token;

      $log.debug('Token', token, Util.isHerokuOrigin(config.url));

      if (token && (Util.isSameOrigin(config.url) || Util.isHerokuOrigin(config.url) )) {
        config.headers.Authorization = 'Bearer ' + token;
      }

      return config;
    },

    // Intercept 401s and redirect you to login
    responseError(response) {
      if (response.status === 401) {
        (state || (state = $injector.get('$state'))).go('login');

        //TODO this should call logout - probably clean up public key store also
        // remove any stale tokens
        $localStorage.currentUser = undefined;
        $localStorage.token = undefined;
      }
      return $q.reject(response);
    }
  };
}

angular.module('bbqApp.auth')
  .factory('authInterceptor', authInterceptor);

})();
