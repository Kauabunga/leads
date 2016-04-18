
(function(){


  'use strict';

  angular.module('bbqApp')
    .directive('rightArrowSvg', function () {
      return {
        templateUrl: 'components/svg/rightArrow.svg.html',
        restrict: 'E'
      };
    });

})();
