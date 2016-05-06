'use strict';

angular.module('bbqApp')
  .directive('bbqInfo', function (Auth, $state, $log, $http, Util, feedbackService) {
    return {
      templateUrl: 'components/bbq-info/bbq-info.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {

        return init();

        function init(){

        }

      }
    };
  });
