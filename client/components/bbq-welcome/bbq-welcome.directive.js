'use strict';

angular.module('bbqApp')
  .directive('bbqWelcome', function (Auth, $state, $log, $http, Util, $localStorage, modalService) {
    return {
      templateUrl: 'components/bbq-welcome/bbq-welcome.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {

        return init();

        function init(){
          $localStorage.welcomeViewed = true;
          scope.gotoMain = gotoMain;
        }

        function gotoMain(){
          return $state.go('main',{},{location:'replace'});
        }

      }
    };
  });
