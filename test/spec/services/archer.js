'use strict';

describe('Service: Archer', function () {

  // load the service's module
  beforeEach(module('clashApp'));

  // instantiate service
  var Archer;
  beforeEach(inject(function (_Archer_) {
    Archer = _Archer_;
  }));

  it('should do something', function () {
    expect(!!Archer).toBe(true);
  });

});
