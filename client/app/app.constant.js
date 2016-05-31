(function(angular, undefined) {
'use strict';

angular.module('bbqApp.constants', [])

.constant('dist', true)

.constant('appConfig', {userRoles:['guest','user','admin'],baseApiUrl:'https://solnet-leads.herokuapp.com/'})

;
})(angular);