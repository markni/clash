'use strict';

angular.module('clashApp')
	.factory('Squad', function (Tank, Spear, Healer, Archer, Dead,$timeout) {

		var jobs = [Tank,Spear,Healer,Archer];

		function Squad(height,width){
			this.w = width;
			this.h = height;
			this.list = [];
			this.init();


		}

		Squad.prototype.init = function(){

			if(this.w && this.h){
				for (var i=0;i<this.w*this.h;i++){
					var Soldier = this.getANewSoldier();
					var pos = this.iToPo(i);
					Soldier.x  = pos.x;
					Soldier.y = pos.y;
					this.list[i]= Soldier;

				}

			}
			console.log('DONE INIT PROGRESS..');
		};

		Squad.prototype.iToPo = function(i) {
			var x = i % this.h,
				y = (i - x) / this.h;
			return {
				x: x,
				y: y
			};
		};

		// Helper to convert coordinates to position
		Squad.prototype.poToI = function(x,y) {
			return (y * this.h) + x;
		};


		Squad.prototype.getANewSoldier = function(){
			if(jobs.length<=0){
				jobs = [Tank,Spear,Healer,Archer];
			}
			var newJob =  jobs.splice(Math.floor(Math.random()*jobs.length),1)
			var newSoldier =    new newJob[0]();
			return newSoldier;

		};




		Squad.prototype.getSoldierByPos= function(x,y){
			if (x<0 || y < 0){
				return null;
			}
			var index = this.poToI(x, y);
			var soldier = this.list[index];
			return soldier || null;
		};

		Squad.prototype.setSoldierByPos= function(x,y,soldier){
			if (x<0 || y < 0 || x>this.h-1 || y > this.w -1){
				return false;
			}
			var index = this.poToI(x, y);
			if(this.list[index]){
				soldier.x = x;
				soldier.y = y;
				this.list[index]= soldier;
				return true;
			}
			return false;

		};




		Squad.prototype.getMatrix= function(){
			return this.list;
		};

		Squad.prototype.swap = function(s,t,delayed){
			function isAj(s,t){
				if(s.x > 3 || t.x>3){
					console.log('error');
				}
				var xDiff = Math.abs(s.x - t.x);
				var yDiff = Math.abs(s.y - t.y);



				if( ( xDiff === 1 ||  yDiff === 1 ) && xDiff+yDiff === 1 ){
					console.log(t instanceof Dead , t.x , s.x);
					if((t instanceof Dead && t.x > s.x )||(s instanceof Dead && s.x > t.x)){
						//if Dead is bellow living, can't swap
						return false;
					}
					return true;
				}
				return false;
			}

			if(isAj(s,t)){
				console.log('same row');
				var l = this.list;
				var sIndex = this.poToI(s.x, s.y);

				var tIndex = this.poToI(t.x, t.y);

				l[sIndex] = t;
				l[tIndex] = s;

				if(!delayed){
					var tempX = s.x;
					var tempY = s.y;

					s.x = t.x;
					s.y = t.y;
					t.x = tempX;
					t.y = tempY;
				}
				else{
					$timeout(function(){

						var tempX = s.x;
						var tempY = s.y;

						s.x = t.x;
						s.y = t.y;
						t.x = tempX;
						t.y = tempY;

					},100);

				}



//				var tempX = s.x;
//				var tempY = s.y;
//
//				s.x = t.x;
//				s.y = t.y;
//				t.x = tempX;
//				t.y = tempY;

				return true;
			}

			return false;



//			this.list[0][0].health = 100;
		};

		return Squad;

	});




