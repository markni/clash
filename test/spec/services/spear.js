'use strict';

describe('Service: Spear', function () {

  // load the service's module
  beforeEach(module('clashApp'));

  // instantiate service
  var Spear;
  beforeEach(inject(function (_Spear_) {
    Spear = _Spear_;
  }));

  it('should do something', function () {
    expect(!!Spear).toBe(true);
  });

});
