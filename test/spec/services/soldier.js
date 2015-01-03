'use strict';

describe('Service: Soldier', function () {

  // load the service's module
  beforeEach(module('clashApp'));

  // instantiate service
  var Soldier;
  beforeEach(inject(function (_Soldier_) {
    Soldier = _Soldier_;
  }));

  it('should do something', function () {
    expect(!!Soldier).toBe(true);
  });

});
