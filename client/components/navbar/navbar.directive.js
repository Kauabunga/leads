'use strict';

angular.module('bbqApp')
  .directive('navbar', function (Auth, $state, $log, $http, User, Util, feedbackService, $window, $timeout) {
    return {
      templateUrl: 'components/navbar/navbar.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {

        return init();

        function init(){

          scope.hasRole = Auth.hasRole;
          scope.isLoggedIn = Auth.isLoggedIn;

          scope.showMain = _.debounce(showMain, 200);
          scope.showAdmin = _.debounce(showAdmin, 200);

          scope.main = main;
          scope.reload = reload;
          scope.admin = admin;
          scope.logout = logout;

          $timeout(() => scope.fadeIn = true, 34);
        }

        function reload(){
          $window.location.reload();
        }

        function showAdmin(){
          return Auth.hasRole('admin') && $state.current.name !== 'admin';
        }

        function showMain(){
          return Auth.hasRole('admin') && $state.current.name !== 'main';
        }

        function admin(){
          $state.go('admin');
        }

        function main(){
          $state.go('main');
        }

        function logout(){
          Auth.logout();
          scope.$evalAsync(() => $state.go('login'));
        }

      }
    };
  });
