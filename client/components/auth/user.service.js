'use strict';

(function() {

function UserResource($resource, Util) {

  const USERS_API = `${Util.getBaseApiUrl()}api/users`;

  return $resource(`${USERS_API}/:id/:controller`, {
    id: '@_id'
  }, {
    changePassword: {
      method: 'PUT',
      params: {
        controller: 'password'
      }
    },
    get: {
      method: 'GET',
      params: {
        id: 'me'
      }
    }
  });
}

angular.module('bbqApp.auth')
  .factory('User', UserResource);

})();
