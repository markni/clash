'use strict';

angular.module('clashApp')
  .factory('Spear', function (Soldier) {
		function Spear() {
			Soldier.call(this);
			this.className = 'spear';
			this.health = 4;
			this.MAXHEALTH = this.health;
			this.attackRange = 1;
			this.attack = 3;
		}

		Spear.prototype = new Soldier();

		// Public API here
		return Spear;
  });
