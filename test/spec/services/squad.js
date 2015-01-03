'use strict';

describe('Service: Squad', function () {

  // load the service's module
  beforeEach(module('clashApp'));

  // instantiate service
  var Squad;
  beforeEach(inject(function (_Squad_) {
    Squad = _Squad_;
  }));

  it('should do something', function () {
    expect(!!Squad).toBe(true);
  });

});
