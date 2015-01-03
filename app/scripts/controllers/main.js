'use strict';

angular.module('clashApp')
	.controller('MainCtrl', function ($scope, Squad, Dead, Spear, Healer, Tank, Archer, $timeout) {

		if(navigator.userAgent.match(/iPad/i) != null){

			document.title = 'Clash';
		}

		var snd = new Audio("sounds/clash.mp3"); // buffers automatically when created
		var snd2 = new Audio("sounds/clash2.mp3");
		var snd3 = new Audio("sounds/clash3.mp3");
		var snd4 = new Audio("sounds/clash4.mp3");
		var sfx = [snd, snd2, snd3, snd4];
		var clickSfx = new Audio("sounds/click.mp3"); // buffers automatically when created
		var gems = [];

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
		var localStorageKeyNameForGuide = 'clashGuideViewed';

		var guideViewed = parseInt(localStorage[localStorageKeyNameForGuide] || 0);

		var totalNumSoldiers = WIDTH * HEIGHT;

		$scope.gameOver = false;
		$scope.turn = 0;
		$scope.movesLeft = 10;
		$scope.MAXMOVESLEFT = $scope.movesLeft;
		$scope.comments = 0;

//		$scope.score = 0;
		var combo = 0;
		var combos = [];

		var highScore = parseInt(localStorage[localStorageKeyName] || 0);

		$scope.enemyMatrix = [];

		$scope.matrix = [];

		$scope.demoMatrix = [];

		$timeout(function(){
			var s = new Squad(2, 6);
			$scope.demoMatrix = s.getMatrix();

		},500);

		$timeout(function () {
			gems = new Array($scope.MAXMOVESLEFT);
			$scope.enemyMatrix = enemySquad.getMatrix();

			$scope.matrix = squad.getMatrix();


		}, 500);

		var killed = 0;



		if(guideViewed){
			$scope.currentGuide = -1;
		}
		else{
			$scope.currentGuide = 0;
		}

		$scope.MAXGUIDES = 4;
		$scope.guideFlags = new Array($scope.MAXGUIDES);

		$scope.resetGame = function () {

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
			gems = new Array($scope.MAXMOVESLEFT);
			$scope.enemyMatrix = enemySquad.getMatrix();

			$scope.matrix = squad.getMatrix();
			killed = 0;

		};

		$scope.displayClass = {
			guideAnimation:function(whichGuide){
				if(whichGuide===0){
					return $scope.guideFlags[0] ? 'hideleft' : '';
				}

			},
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
				else if (dir === 'left') {
					return 'hideleft';
				}
				else {
					return 'benddown';
				}

			},
			deathAnimation: function (soldier) {
				return (soldier.health <= 0 && soldier instanceof Dead !== true) ? 'killed' : '';
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


		$scope.moveNext = function(from){
			console.log('move next',from);
			if(typeof from == 'undefined'){
				$scope.currentGuide ++ ;
			}
			else if(from === 0){
				console.log('workds');
				$scope.guideFlags[0] = 1;
				$timeout(function(){
					$scope.currentGuide ++ ;

				},1000);

			}

			if($scope.currentGuide>=$scope.MAXGUIDES){
				$scope.currentGuide = -1;
				localStorage[localStorageKeyNameForGuide] =1;
				$scope.resetGame();
			}

		};

		$scope.clearRangesHighlight = function () {
			inRanges = [];
		};

		$scope.showInRanges = function (isSelfSquad, soldier) {

			var _squad;
			var _enemySquad;
			var x = soldier.x;
			var y = soldier.y;

			if (isSelfSquad) {
				_squad = squad;
				_enemySquad = enemySquad;

			}
			else {
				_squad = enemySquad;
				_enemySquad = squad;
			}

			if (soldier instanceof Healer) {

				var soldierUp = _squad.getSoldierByPos(x - 1, y);
				var soldierDown = _squad.getSoldierByPos(x + 1, y);
				var soldierLeft = _squad.getSoldierByPos(x, y - 1);
				var soldierRight = _squad.getSoldierByPos(x, y + 1);

				if (soldierUp)    inRanges.push(soldierUp); // heal up;
				if (soldierDown)    inRanges.push(soldierDown); // heal down;
				if (soldierLeft)    inRanges.push(soldierLeft); // heal left;
				if (soldierRight)    inRanges.push(soldierRight); // heal right;
			}

			else {
				var targetSoldier = _enemySquad.getSoldierByPos(soldier.attackRange - 1 - x, y);
				if (targetSoldier) {
					inRanges.push(targetSoldier);
				}

			}

			//display enemies beging targeted with highlight;
		};

		$scope.getAbsPos = function (reverse, soldier) {
			var style = {};

			var leftMargin = 100;
			if (!reverse) {

//				style.top = soldier.x * 60 + 'px';
				style["-webkit-transform"] = 'translateY('+soldier.x * 60 + 'px'+')'


			}

			else {
//				style.bottom = soldier.x * 60 + 'px';
				style["-webkit-transform"] = 'translateY('+soldier.x * -60 + 'px'+')'

			}

//			style.left = soldier.y * 60 + leftMargin + 'px';
			style["-webkit-transform"] += ' translateX('+(soldier.y * 60 + leftMargin) + 'px'+')'

			style["transform"] = style["-webkit-transform"];


			return style;
		};

		$scope.runClashAnimation = function () {

			$scope.clashAnimationOn = true;
			$timeout(function () {

				$scope.clashAnimationOn = false;

			}, 1500);

		};

		$scope.getScore = function () {
			return score;
		};

		$scope.getKilled = function () {
			return killed;

		};

		$scope.getGems = function () {
			return gems;
		};

		$scope.getCombos = function () {
			if ($scope.gameOver) {
				return combos;
			}
			else {
				return [];
			}
		};

		$scope.updateScore = function () {
			score++;

			combo++;
			killed++;

			$timeout(function () {
				if (highScore < score) {
					highScore = score;
					localStorage[localStorageKeyName] = score;

				}
			})
		};

		$scope.getHighScore = function () {
			return highScore;
		};

		$scope.playSound = function () {
			if (sfx.length === 0) {
				sfx = [snd, snd2, snd3, snd4];
			}

			var s = sfx.splice(Math.floor(Math.random() * sfx.length), 1)[0];
			s.play();

		};

		$scope.clash = function () {

			clickSfx.play();

			selected = null;
			targeted = null;

			$scope.runClashAnimation();

			$timeout(function () {
				heal(squad);
				heal(enemySquad);

				$scope.playSound();


			}, 900);

			$timeout(function () {

				battle();
			}, 1200);

			$timeout(function () {

				removeDeadBody(squad, 1);
				removeDeadBody(enemySquad, 0);
				removeDeadBody(squad, 1);
				removeDeadBody(enemySquad, 0);
				refill(enemySquad);

//				removeDeadBody(squad,1);
//				removeDeadBody(enemySquad,0);

				if (combo) {
					combos[combo] === undefined ? combos[combo] = 1 : combos[combo]++;
				}
				score += parseInt(Math.pow(3.3, combo) - 1);
				combo = 0;
			}, 1500);

			$scope.turn++;
			$scope.movesLeft = 10;

			function heal(_squad) {
				for (var x = 0; x < _squad.h; x++) {
					for (var y = 0; y < _squad.w; y++) {

						var soldier = _squad.getSoldierByPos(x, y);

						if (soldier && soldier instanceof Healer) {

							healAround(soldier, _squad);
						}

					}
				}

				function healAround(soldier, m) {
					if (!soldier || soldier instanceof Dead) return;
					var x = soldier.x;
					var y = soldier.y;
					var soldierUp = _squad.getSoldierByPos(x - 1, y);
					var soldierDown = _squad.getSoldierByPos(x + 1, y);
					var soldierLeft = _squad.getSoldierByPos(x, y - 1);
					var soldierRight = _squad.getSoldierByPos(x, y + 1);

					if (soldierUp)    healBy(soldierUp); // heal up;
					if (soldierDown)    healBy(soldierDown); // heal down;
					if (soldierLeft)    healBy(soldierLeft); // heal left;
					if (soldierRight)    healBy(soldierRight); // heal right;

				}

				function healBy(soldier) {
					var nextH = soldier.health + 1;
					soldier.health = Math.min(nextH, soldier.MAXHEALTH);
					console.log('healed');
				}

			}

			function battle() {
				var matrix = $scope.matrix;
				var enemyMatrix = $scope.enemyMatrix;

				function attack(soldier, isSelf) {
					if (!soldier || soldier instanceof Dead) {
						return;
					}

					var _enemySquad;
					if (isSelf) {

						_enemySquad = enemySquad;
					}
					else {
						_enemySquad = squad;
					}

					var targetSoldier = _enemySquad.getSoldierByPos(soldier.attackRange - 1 - soldier.x, soldier.y);

					if (targetSoldier && targetSoldier instanceof Dead !== true) {

						targetSoldier.health -= soldier.attack;
					}

				}

				for (var x = 0; x < 2; x++) {
					for (var y = 0; y < WIDTH; y++) {
						var mySoldier = squad.getSoldierByPos(x, y);
						var enemySoldier = enemySquad.getSoldierByPos(x, y);
						attack(mySoldier, 1);
						attack(enemySoldier, 0);
					}
				}
			}

			function refill(_squad){
				for (var x = 0; x < _squad.h; x++) {
					for (var y = 0; y < _squad.w; y++) {
						var soldier = _squad.getSoldierByPos(x, y);
						if (soldier && soldier instanceof Dead){
								var newSoldier = _squad.getANewSoldier();  //Pick a random solider
								_squad.setSoldierByPos(x, y, newSoldier);
						}

					}
				}
			}

			function removeDeadBody(_squad, isSelf) {
				for (var x = 0; x < _squad.h; x++) {
					for (var y = 0; y < _squad.w; y++) {
						var soldier = _squad.getSoldierByPos(x, y);
						var soldierBellow = _squad.getSoldierByPos(x + 1, y);

						if (soldier && soldier.health < 1 && soldier instanceof Dead !== true) {

							console.log('markdead');

							if (!isSelf) {
								//if dead found in enemy squad, update scores;

								$scope.updateScore();



							}

							else{
								totalNumSoldiers--;

								if (totalNumSoldiers <= 0) {
									$scope.gameOver = true;

								}
							}

							var soldier = new Dead();
							_squad.setSoldierByPos(x, y, soldier);



						}
						if (soldier && soldier instanceof Dead && soldierBellow && soldierBellow instanceof Dead !== true) {
							console.log('swap');
							_squad.swap(soldier, soldierBellow);
						}

					}
				}

			}

		};

		$scope.reportPos = function (soldier) {
			console.log(soldier.x, soldier.y);
//			clickSfx.play();

		};

		$scope.go = function (soldier) {

//			clickSfx.play();
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

					if (squad.swap(selected, targeted,1)) {
						//swapped
						selected = null;
						targeted = null;

						if($scope.currentGuide === 1){

							$timeout(function(){
								$scope.moveNext();
							},1000);

						}
						else{
							$scope.movesLeft--;
						}

					}
					else {

						//if invalid swap, clear selection Todo:play a error sound here?
						selected = null;
						targeted = null;
					}

				}

				console.log('selected:' + selected);
				console.log('targeted:' + targeted);
			}
		}
	});
