'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('clashApp'));

  var MainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should limit max number pages of guide to be 4', function () {
    expect(scope.MAXGUIDES).toBe(4);
    expect(scope.guideFlags.length).toBe(4);
  });
});
