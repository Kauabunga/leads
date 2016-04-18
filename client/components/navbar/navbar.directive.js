'use strict';

angular.module('bbqApp')
  .directive('navbar', function (Auth, $state, $log, $http, User, Util, feedbackService, $window) {
    return {
      templateUrl: 'components/navbar/navbar.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {

        return init();

        function init(){

          scope.hasRole = Auth.hasRole;
          scope.isLoggedIn = Auth.isLoggedIn;

          scope.reload = reload;
          scope.admin = admin;
          scope.logout = logout;
        }

        function reload(){
          $window.location.reload();
        }

        function admin(){
          $state.go('admin');
        }

        function logout(){
          $state.go('logout');
        }

      }
    };
  });
