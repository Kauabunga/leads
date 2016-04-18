'use strict';

angular.module('bbqApp')
  .directive('bbqAdmin', function (Auth, $state, $log, $http, Util, feedbackService) {
    return {
      templateUrl: 'components/bbq-admin/bbq-admin.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {

        return init();

        function init(){

        }

      }
    };
  });
