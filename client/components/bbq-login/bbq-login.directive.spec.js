'use strict';

describe('Directive: bbqLogin', function () {

  // load the directive's module and view
  beforeEach(module('bbqApp.bbq-login'));
  beforeEach(module('components/bbq-login/bbq-login.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    //element = angular.element('<bbq-login></bbq-login>');
    //element = $compile(element)(scope);
    //scope.$apply();
    //element.text().should.equal('this is the bbqLogin directive');
  }));
});
