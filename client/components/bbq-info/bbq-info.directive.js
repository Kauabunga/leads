'use strict';

angular.module('bbqApp')
  .directive('bbqInfo', function (Auth, $state, $log, $http, Util, modalService) {
    return {
      templateUrl: 'components/bbq-info/bbq-info.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {

        return init();

        function init(){

          scope.showFeedbackModel = modalService.showFeedbackModel;
          scope.showAddToHomescreenModel = modalService.showAddToHomescreenModel;
          scope.showUseSpeechToTextModel = modalService.showUseSpeechToTextModel;
        }

      }
    };
  });
