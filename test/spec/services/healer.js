'use strict';

describe('Service: Healer', function () {

  // load the service's module
  beforeEach(module('clashApp'));

  // instantiate service
  var Healer;
  beforeEach(inject(function (_Healer_) {
    Healer = _Healer_;
  }));

  it('should do something', function () {
    expect(!!Healer).toBe(true);
  });

});
