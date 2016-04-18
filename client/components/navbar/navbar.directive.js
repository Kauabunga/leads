'use strict';

angular.module('bbqApp')
  .directive('navbar', function (Auth, $state, $log, $http, Util, feedbackService) {
    return {
      templateUrl: 'components/navbar/navbar.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {

        return init();

        function init(){

        }

      }
    };
  });
