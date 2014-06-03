'use strict';

angular.module('clashApp')
	.factory('Soldier', function () {
		function Soldier() {
			this.moved = false;
			this.x;
			this.y;
			this.id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
				return v.toString(16);
			});

		}

		Soldier.prototype.attack = function (target) {
			this.moved = true;

		};

		Soldier.prototype.swap = function (direction) {
			this.moved = true;

		};

		return Soldier;
	}).directive('myDirective2',function(){

		return {
			compile: function(element) {
				element.html('<script>{{extraScript}}</script>');
			}
		};

	}).directive('myDirective', function() {
		return {
			template: '<input ng-model="foo">{{extraScript}}'
		};
	});