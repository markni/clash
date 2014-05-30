'use strict';

angular.module('clashApp')
	.controller('MainCtrl', function ($scope, Squad, Dead, Spear, Healer, Tank, Archer, $timeout) {


		var snd = new Audio("sounds/clash.mp3"); // buffers automatically when created
		var snd2 = new Audio("sounds/clash2.mp3");
		var snd3 = new Audio("sounds/clash3.mp3");
		var snd4 = new Audio("sounds/clash4.mp3");
		var sfx = [snd,snd2,snd3,snd4];
		var clickSfx = new Audio("sounds/click.mp3"); // buffers automatically when created


		var selected = null;
		var targeted = null;
		var inRanges = [];

		var jobs = [Spear, Healer, Tank, Archer];

		var WIDTH = 7;
		var HEIGHT = 4;

		var score = 0;

		var enemySquad = new Squad(HEIGHT, WIDTH);

		var squad = new Squad(HEIGHT, WIDTH);

		var localStorageKeyName = 'clashHightScore4';

		var totalNumSoldiers = WIDTH * HEIGHT;

		$scope.gameOver = false;
		$scope.turn = 0;
		$scope.movesLeft = 10;
		$scope.MAXMOVESLEFT = $scope.movesLeft;

//		$scope.score = 0;
		var combo = 0;
		var combos = [];



		var highScore = parseInt(localStorage[localStorageKeyName] || 0);

		$scope.enemyMatrix = [];

		$scope.matrix = [];

		$timeout(function(){
			$scope.enemyMatrix = enemySquad.getMatrix();

			$scope.matrix = squad.getMatrix();
		},500);

		var killed = 0;


		$scope.resetGame = function () {
			clickSfx.play();
			selected = null;
			targeted = null;
			inRanges = [];
			enemySquad = new Squad(HEIGHT, WIDTH);

			squad = new Squad(HEIGHT, WIDTH);

			totalNumSoldiers = WIDTH * HEIGHT;

			$scope.gameOver = false;
			$scope.turn = 0;
			$scope.movesLeft = 10;
			$scope.MAXMOVESLEFT = $scope.movesLeft;
			score = 0;
			combo = 0;
			combos = [];
			$scope.enemyMatrix = enemySquad.getMatrix();

			$scope.matrix = squad.getMatrix();
			killed = 0;

		};

		$scope.range = function (n) {
			return new Array(n);
		};

		$scope.displayClass = {
			selected: function (soldier) {
				return soldier === selected ? 'selected' : '';
			},
			highlighted: function (soldier) {
				return inRanges.indexOf(soldier) !== -1 ? 'highlighted' : '';
			},
			clashAnimation: function (dir) {
				if (!$scope.clashAnimationOn) {
					return '';
				}
				if (dir === 'up') {
					return 'bendup';
				}
				else if (dir === 'left'){
					return 'hideleft';
				}
				else {
					return 'benddown';
				}

			},
			deathAnimation:function(soldier){
					return (soldier.health<=0 && soldier instanceof Dead !== true) ? 'killed': '';
			},
			getGemClass: function (index) {

				if (index >= $scope.movesLeft) {
					return 'gem-empty';
				}
				else {
					return 'gem-full';
				}

			}

		};

		$scope.clearRangesHighlight = function () {
			inRanges = [];
		};

		$scope.showInRanges = function (isSelfMaxtrix, soldier) {
			console.log(inRanges);


			var matrix;
			var enemyMatrix;
			var x = soldier.x;
			var y = soldier.y;

			if (isSelfMaxtrix) {
				matrix = $scope.matrix;
				enemyMatrix = $scope.enemyMatrix;

			}
			else {
				matrix = $scope.enemyMatrix;
				enemyMatrix = $scope.matrix;
			}

			if (soldier instanceof Healer) {

				if (matrix[x - 1] && matrix[x - 1][y])    inRanges.push(matrix[x - 1][y]); // heal up;
				if (matrix[x + 1] && matrix[x + 1][y])    inRanges.push(matrix[x + 1][y]); // heal down;
				if (matrix[x] && matrix[x][y - 1])    inRanges.push(matrix[x][y - 1]); // heal left;
				if (matrix[x] && matrix[x][y + 1])    inRanges.push(matrix[x][y + 1]); // heal right;
			}
			else {
				if (enemyMatrix[soldier.attackRange - 1 - x] && enemyMatrix[soldier.attackRange - 1 - x][y])
					inRanges.push(enemyMatrix[soldier.attackRange - 1 - x][y]);

			}

			//display enemies beging targeted with highlight;
		}

		$scope.getAbsPos = function (reverse, soldier) {
			var style = {};
			var leftMargin = 100;
			if (!reverse) {

				style.top = soldier.x * 60 + 'px';

			}

			else {
				style.bottom = soldier.x * 60 + 'px';

			}

			style.left = soldier.y * 60 + leftMargin + 'px';

			return style;
		};

		$scope.awesomeThings = [
			squad.w,
			'AngularJS',
			'Karma'
		];

		$scope.runClashAnimation = function () {

			$scope.clashAnimationOn = true;
			$timeout(function () {

				$scope.clashAnimationOn = false;

			}, 1500);

		};

		$scope.getScore = function(){
			return score;
		};
		
		$scope.getKilled = function(){
			return killed;


		};

		$scope.getCombos = function(){
			if($scope.gameOver){
				return combos;
			}
			else{
				return [];
			}
		};
		

		$scope.getHighScore = function(){
			return highScore;
		};

		$scope.playSound = function(){
			if(sfx.length===0){
				sfx =[snd,snd2,snd3,snd4];
			}

			var s = sfx.splice(Math.floor(Math.random()*sfx.length),1)[0];
			s.play();

		} ;

		$scope.clash = function () {

			clickSfx.play();

			selected = null;
			targeted = null;

			$scope.runClashAnimation();

			$timeout(function () {
				heal();
				battle();

				$scope.playSound();

			}, 900);

			$timeout(function () {
				removeDeadBody();
				removeDeadBody();
				if(combo){
					combos[combo] === undefined ? combos[combo] = 1 : combos[combo] ++;
				}
				score += parseInt(Math.pow(3.3,combo) -1);
				combo = 0;
			}, 1500);

			$scope.turn++;
			$scope.movesLeft = 10;

			function heal() {
				var matrix = $scope.matrix;
				var enemyMatrix = $scope.enemyMatrix;
				for (var x = 0; x < HEIGHT; x++) {
					for (var y = 0; y < WIDTH; y++) {

						var mySoldier = matrix[x][y];
						var enemySoldier = enemyMatrix[x][y];
						if (mySoldier && mySoldier.className === "healer") {

							healAround(mySoldier, matrix);
						}
						if (enemySoldier && enemySoldier.className === "healer") {
							healAround(enemySoldier, enemyMatrix);
						}

					}
				}

				function healAround(soldier, m) {
					if (!soldier || soldier.className === 'dead') return;
					var x = soldier.x;
					var y = soldier.y;
					if (m[x - 1] && m[x - 1][y])    healBy(m[x - 1][y]); // heal up;
					if (m[x + 1] && m[x + 1][y])    healBy(m[x + 1][y]); // heal down;
					if (m[x] && m[x][y - 1])    healBy(m[x][y - 1]); // heal left;
					if (m[x] && m[x][y + 1])    healBy(m[x][y + 1]); // heal right;

				}

				function healBy(soldier) {
					var currentH = soldier.health;
					var nextH = soldier.health + 1;
					soldier.health = Math.min(nextH, soldier.MAXHEALTH);
					console.log('healed');

				}

			}

			function battle() {
				var matrix = $scope.matrix;
				var enemyMatrix = $scope.enemyMatrix;

				function attack(soldier, isSelf){
				 	if(!soldier || soldier instanceof Dead){
						return;
					}

					var em;
					if (isSelf){

						em = enemyMatrix;
					}
					else{
						em = matrix;
					}

					var enemyXPos = soldier.attackRange - 1 - soldier.x;

					if (em[enemyXPos]) {

						var targetSoldier = em[enemyXPos][soldier.y];
						if (targetSoldier && targetSoldier instanceof Dead !== true) {

							targetSoldier.health -= soldier.attack;
						}
					}
				}

				for (var x = 0; x < 2; x++) {
					for (var y = 0; y < WIDTH; y++) {
						var mySoldier = matrix[x][y];
						var enemySoldier = enemyMatrix[x][y];
						attack(mySoldier,1);
						attack(enemySoldier,0);
					}
				}
			}

			function removeDeadBody() {
				var matrix = $scope.matrix;
				var enemyMatrix = $scope.enemyMatrix;
				for (var x = 0; x < 2; x++) {
					for (var y = 0; y < WIDTH; y++) {
						check(matrix, x, y, squad);
						check(enemyMatrix, x, y, enemySquad);

					}
				}

				for (var x = 0; x < 2; x++) {
					for (var y = 0; y < WIDTH; y++) {
						shift(matrix, x, y, squad, false);
						shift(enemyMatrix, x, y, enemySquad, true);

					}
				}



				function check(m, x, y, s) {
					var soldier = m[x][y];
					if (soldier && soldier.health < 1 && soldier instanceof Dead !== true) {
						console.log('fire arrow');
						m[x][y] = undefined;

					}
					if (soldier instanceof Dead === true && m[x+1] && m[x+1][y] && m[x+1][y] instanceof Dead !== true) {
						console.log('force to move forward');
						m[x][y] = undefined;

					}

				}

				function shift(m, x, y, s, t) {
					var soldier = m[x][y];
					if (!soldier) {
						console.log('find dead body');
						//find dead body
						while (m[x + 1] && m[x + 1][y] && m[x + 1][y] instanceof Dead !== true) {
							m[x][y] = m[x + 1][y];
							m[x][y].x = x;
							m[x][y].y = y;
							x = x + 1;
						}

						if (t) {



							score++;

							combo++;
							killed++;

							var Soldier = enemySquad.getANewSoldier();  //Pick a random solider
							Soldier.x = x;
							Soldier.y = y;
							m[x][y] = Soldier;
							$timeout(function(){
								if (highScore <score ) {
									highScore = score ;
									localStorage[localStorageKeyName] = score ;


								}
							})

						}
						else {
							m[x][y] = new Dead();
							m[x][y].x = x;
							m[x][y].y = y;

							totalNumSoldiers--;

							if (totalNumSoldiers <= 0) {
								$scope.gameOver = true;

							}

						}

					}
				}
			}

		};

		$scope.reportPos = function (soldier) {
			console.log(soldier.x, soldier.y);
			clickSfx.play();

		};

		$scope.go = function (soldier) {
//			if (evt.target.classList && evt.target.classList.contains('soldier')){
//				console.log('found');
//
//			}
			clickSfx.play();
			if ($scope.movesLeft > 0) {
				console.log(soldier);
				if (selected) {
					if (selected === soldier) {
						//clicked again;
						selected = null;
					}
					else {
						targeted = soldier;
					}

				}
				else {
					selected = soldier;
				}
				if (targeted) {
					console.log('swap');
					if (squad.swap(selected, targeted)) {
						//swapped
						selected = null;
						targeted = null;
						$scope.movesLeft--;
					}
					else {

						selected = targeted;
						targeted = null;
					}

				}

				console.log('selected:' + selected);
				console.log('targeted:' + targeted);
			}
		}
	});
