'use strict';

angular.module('bbqApp')
  .directive('navbar', function (Auth, $state, $log, $http, User, Util, feedbackService, $window, $timeout, modalService) {
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
          scope.isInfoDebounce = _.debounce(isInfo, 200);
          scope.isInfo = isInfo;

          scope.main = main;
          scope.reload = reload;
          scope.admin = admin;
          scope.logout = logout;
          scope.info = info;
          scope.login = login;


          $timeout(() => scope.fadeIn = true, 34);
        }

        function reload(){

          return modalService.confirmRefreshModal()
            .then(() => {
              $window.location.reload();
            }, () => {});
        }

        function login(){
          $state.go('login');
        }

        function isInfo(){
          return $state.current.name === 'info';
        }

        function info(){
          $state.go('info');
        }

        function showAdmin(){
          return Auth.hasRole('admin') && $state.current.name !== 'admin';
        }

        function showMain(){
          return $state.current.name !== 'main';
        }

        function admin(){
          $state.go('admin');
        }

        function main(){
          $state.go('main');
        }

        function logout(){
          return modalService.confirmLogoutModal()
          .then(() => {
              Auth.logout();
              scope.$evalAsync(() => $state.go('login'));
            }, () => {});
        }

      }
    };
  });
