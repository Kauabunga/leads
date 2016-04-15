'use strict';

(function() {

function AuthService($location, $http, $log, $q, appConfig, Util, User, $localStorage) {
  var safeCb = Util.safeCb;
  var currentUser = {};
  var userRoles = appConfig.userRoles || [];

  const USERS_API = `${Util.getBaseApiUrl()}api/users`;
  const AUTH_API = `${Util.getBaseApiUrl()}auth/local`;

  if ($localStorage.token && $location.path() !== '/logout') {
    currentUser = User.get();
  }

  var Auth = {

    sendTokenEmail({ email = '' }) {

      if(email.split('@').length !== 2){
        return $q.reject();
      }

      let emailParsed = `${email.split('@')[0]}@${email.split('@')[1].toLowerCase()}`;

      return $http.post(USERS_API, { email: emailParsed })
        .then(res => {
          return res;
        });
    },

    /**
     * Authenticate user and save token
     *
     * @param  {Object}   user     - login info
     * @param  {Function} callback - optional, function(error, user)
     * @return {Promise}
     */
    login({email = '', registerToken}, callback) {


      if(email.split('@').length !== 2){
        return $q.reject();
      }

      let emailParsed = `${email.split('@')[0]}@${email.split('@')[1].toLowerCase()}`;

      $log.debug('parsed email', emailParsed);


      return $http.post(AUTH_API, {
        email: emailParsed,
        password: registerToken.toString()
      })
        .then(res => {
          $localStorage.token = res.data.token;

          currentUser = User.get();
          return currentUser.$promise;
        })
        .then(user => {
          safeCb(callback)(null, user);
          return user;
        })
        .catch(err => {
          Auth.logout();
          safeCb(callback)(err.data);
          return $q.reject(err.data);
        });
    },

    /**
     * Delete access token and user info
     */
    logout() {
      $localStorage.token = undefined;
      currentUser = {};
    },


    /**
     * Change password
     *
     * @param  {String}   oldPassword
     * @param  {String}   newPassword
     * @param  {Function} callback    - optional, function(error, user)
     * @return {Promise}
     */
    changePassword(oldPassword, newPassword, callback) {
      return User.changePassword({ id: currentUser._id }, {
        oldPassword: oldPassword,
        newPassword: newPassword
      }, function() {
        return safeCb(callback)(null);
      }, function(err) {
        return safeCb(callback)(err);
      }).$promise;
    },

    /**
     * Gets all available info on a user
     *   (synchronous|asynchronous)
     *
     * @param  {Function|*} callback - optional, funciton(user)
     * @return {Object|Promise}
     */
    getCurrentUser(callback) {
      if (arguments.length === 0) {
        return currentUser;
      }

      var value = (currentUser.hasOwnProperty('$promise')) ?
        currentUser.$promise : currentUser;
      return $q.when(value)
        .then(user => {
          safeCb(callback)(user);
          return user;
        }, () => {
          safeCb(callback)({});
          return {};
        });
    },

    /**
     * Check if a user is logged in
     *   (synchronous|asynchronous)
     *
     * @param  {Function|*} callback - optional, function(is)
     * @return {Bool|Promise}
     */
    isLoggedIn(callback) {
      if (arguments.length === 0) {
        return currentUser.hasOwnProperty('role');
      }

      return Auth.getCurrentUser(null)
        .then(user => {
          var is = user.hasOwnProperty('role');
          safeCb(callback)(is);
          return is;
        });
    },

     /**
      * Check if a user has a specified role or higher
      *   (synchronous|asynchronous)
      *
      * @param  {String}     role     - the role to check against
      * @param  {Function|*} callback - optional, function(has)
      * @return {Bool|Promise}
      */
    hasRole(role, callback) {
      var hasRole = function(r, h) {
        return userRoles.indexOf(r) >= userRoles.indexOf(h);
      };

      if (arguments.length < 2) {
        return hasRole(currentUser.role, role);
      }

      return Auth.getCurrentUser(null)
        .then(user => {
          var has = (user.hasOwnProperty('role')) ?
            hasRole(user.role, role) : false;
          safeCb(callback)(has);
          return has;
        });
    },

     /**
      * Check if a user is an admin
      *   (synchronous|asynchronous)
      *
      * @param  {Function|*} callback - optional, function(is)
      * @return {Bool|Promise}
      */
    isAdmin() {
      return Auth.hasRole
        .apply(Auth, [].concat.apply(['admin'], arguments));
    },

    /**
     * Get auth token
     *
     * @return {String} - a token string used for authenticating
     */
    getToken() {
      return $localStorage.token;
    }
  };

  return Auth;
}

angular.module('bbqApp.auth')
  .factory('Auth', AuthService);

})();
