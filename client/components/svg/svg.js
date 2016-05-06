
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
    })
    .directive('editSvg', function () {
      return {
        templateUrl: 'components/svg/edit.svg.html', restrict: 'E', replace: true
      };
    })
    .directive('homeSvg', function () {
      return {
        templateUrl: 'components/svg/home.svg.html', restrict: 'E', replace: true
      };
    })
    .directive('infoSvg', function () {
      return {
        templateUrl: 'components/svg/info.svg.html', restrict: 'E', replace: true
      };
    })
    .directive('loginSvg', function () {
      return {
        templateUrl: 'components/svg/login.svg.html', restrict: 'E', replace: true
      };
    });

})();
