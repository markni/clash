'use strict';

angular.module('clashApp')
  .factory('Archer', function (Soldier) {

		function Archer() {
			Soldier.call(this);
			this.className = 'archer';
			this.health = 2;
			this.MAXHEALTH = this.health;
			this.attackRange = 2;
			this.attack = 4;
		}

		Archer.prototype = new Soldier();

		// Public API here
		return Archer;
  });
