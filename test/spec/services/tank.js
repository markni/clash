'use strict';

describe('Service: Tank', function () {

  // load the service's module
  beforeEach(module('clashApp'));

  // instantiate service
  var Tank;
  beforeEach(inject(function (_Tank_) {
    Tank = _Tank_;
  }));

  it('should do something', function () {
    expect(!!Tank).toBe(true);
  });

});
