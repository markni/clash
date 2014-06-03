'use strict';

angular.module('clashApp')
  .factory('Dead', function (Soldier) {
		function Dead() {
			Soldier.call(this);
			this.className = 'dead';
			this.health = 0;
			this.MAXHEALTH = this.health;
			this.attackRange = 0;
			this.attack = 0;
		}

		Dead.prototype = new Soldier();

		// Public API here
		return Dead;
  });
