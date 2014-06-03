'use strict';

angular.module('clashApp')
  .factory('Healer', function (Soldier) {
		function Healer() {
			Soldier.call(this);
			this.className = 'healer';
			this.health = 3;
			this.MAXHEALTH = this.health;
			this.attackRange = 1;
			this.attack = 2;
		}

		Healer.prototype = new Soldier();

		// Public API here
		return Healer;
  });
