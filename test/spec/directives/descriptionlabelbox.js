'use strict';

describe('Directive: descriptionLabelBox', function () {

  // load the directive's module
  beforeEach(module('labelsApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<description-label-box></description-label-box>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the descriptionLabelBox directive');
  }));
});