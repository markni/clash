'use strict';

angular.module('clashApp')
	.factory('Tank', function (Soldier) {

		function Tank() {
			Soldier.call(this);
			this.className = 'tank';
			this.health = 8;
			this.MAXHEALTH = this.health;
			this.attackRange = 1;
			this.attack = 2;
		}

		Tank.prototype = new Soldier();

		// Public API here
		return Tank;
	});


