'use strict';

describe('Service: Dead', function () {

  // load the service's module
  beforeEach(module('clashApp'));

  // instantiate service
  var Dead;
  beforeEach(inject(function (_Dead_) {
    Dead = _Dead_;
  }));

  it('should do something', function () {
    expect(!!Dead).toBe(true);
  });

});
