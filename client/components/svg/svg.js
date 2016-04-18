
(function(){


  'use strict';

  angular.module('bbqApp')
    .directive('menuSvg', () => {
      return {
        templateUrl: 'components/svg/menu.svg.html', restrict: 'E', replace: true
      };
    })
    .directive('rightArrowSvg', function () {
      return {
        templateUrl: 'components/svg/rightArrow.svg.html', restrict: 'E'
      };
    })
    .directive('refreshSvg', function () {
      return {
        templateUrl: 'components/svg/refresh.svg.html', restrict: 'E', replace: true
      };
    })
    .directive('logoutSvg', function () {
      return {
        templateUrl: 'components/svg/logout.svg.html', restrict: 'E', replace: true
      };
    })
    .directive('settingsSvg', function () {
      return {
        templateUrl: 'components/svg/settings.svg.html', restrict: 'E', replace: true
      };
    });

})();
