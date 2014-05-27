'use strict';

angular.module('clashApp')
	.controller('MainCtrl', function ($scope, Squad, Dead, Spear, Healer, Tank, Archer, $timeout) {

		var selected = null;
		var targeted = null;
		var inRanges = [];

		var jobs = [Spear, Healer, Tank, Archer];

		var WIDTH = 8;
		var HEIGHT = 4;

		var enemySquad = new Squad(HEIGHT, WIDTH);

		var squad = new Squad(HEIGHT, WIDTH);

		$scope.totalNumSoldiers = WIDTH * HEIGHT;

		$scope.gameOver = false;
		$scope.turn = 0;
		$scope.movesLeft = 10;
		$scope.MAXMOVESLEFT = $scope.movesLeft;
		$scope.score = 0;

		$scope.highScore = parseInt(localStorage['clashHightScore'] || 0);

		$scope.enemyMatrix = enemySquad.getMatrix();

		$scope.matrix = squad.getMatrix();

		$scope.resetGame = function () {
			selected = null;
			targeted = null;
			inRanges = [];
			enemySquad = new Squad(HEIGHT, WIDTH);

			squad = new Squad(HEIGHT, WIDTH);

			$scope.totalNumSoldiers = WIDTH * HEIGHT;

			$scope.gameOver = false;
			$scope.turn = 0;
			$scope.movesLeft = 10;
			$scope.MAXMOVESLEFT = $scope.movesLeft;
			$scope.score = 0;

			$scope.enemyMatrix = enemySquad.getMatrix();

			$scope.matrix = squad.getMatrix();

		}

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
				else {
					return 'benddown';
				}

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
			var leftMargin = 50;
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

		$scope.clash = function () {

			selected = null;
			targeted = null;

			$scope.runClashAnimation();

			$timeout(function () {
				heal();
				battle();

			}, 900);

			$timeout(function () {
				removeDeadBody();
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
				for (var x = 0; x < 2; x++) {
					for (var y = 0; y < WIDTH; y++) {
						var mySoldier = matrix[x][y];
						var enemySoldier = enemyMatrix[x][y];
						if (mySoldier) {
							if (mySoldier.className === 'dead') continue;
							if (x === 0) {
								//first row

								if (mySoldier.attackRange === 1) {
									if (mySoldier && enemySoldier) {
										//melee soldier
										if (enemySoldier.attackRange === 1) {
											mySoldier.health -= enemySoldier.attack;
										}
										if (enemySoldier instanceof Dead !== true) {
											enemySoldier.health -= mySoldier.attack;
										}
									}
								}

								else {
									//range soldier
									if (mySoldier && enemySoldier) {
										console.log('range soldier get attacked!');
										mySoldier.health -= enemySoldier.attack;
									}

									if (mySoldier) {

										var enemyXPos = mySoldier.attackRange - 1 - mySoldier.x;

										if (enemyMatrix[enemyXPos]) {

											var targetSoldier = enemyMatrix[enemyXPos][mySoldier.y];
											if (targetSoldier && targetSoldier instanceof Dead !== true) {

												targetSoldier.health -= mySoldier.attack;
											}
										}

									}

									//fix for enemy archer

									if (enemySoldier) {

										var enemyXPos = enemySoldier.attackRange - 1 - enemySoldier.x;

										if (matrix[enemyXPos]) {

											var targetSoldier = matrix[enemyXPos][enemySoldier.y];
											if (targetSoldier && targetSoldier instanceof Dead !== true) {

												targetSoldier.health -= enemySoldier.attack;
											}
										}

									}
								}
							}
							else {
								if (mySoldier.attackRange > mySoldier.x) {
									//range soldier  in back rows that able to attack;

									//since it's in back row, won't be attacked;
									//mySoldier.health -= enemySoldier.attack;

									var enemyXPos = mySoldier.attackRange - 1 - mySoldier.x;
//								console.log(enemyXPos);
									if (enemyMatrix[enemyXPos]) {
//									console.log('fire arrow');
										var targetSoldier = enemyMatrix[enemyXPos][mySoldier.y];
										if (targetSoldier && targetSoldier instanceof Dead !== true) {
//										console.log('fire arrow!!!');
											//fire arrow
											targetSoldier.health -= mySoldier.attack;
										}
									}

								}

								if (enemySoldier.attackRange > enemySoldier.x) {
									//range soldier  in back rows that able to attack;

									//since it's in back row, won't be attacked;
									//mySoldier.health -= enemySoldier.attack;

									var enemyXPos = enemySoldier.attackRange - 1 - enemySoldier.x;
//								console.log(enemyXPos);
									if (matrix[enemyXPos]) {
//									console.log('fire arrow');
										var targetSoldier = matrix[enemyXPos][enemySoldier.y];
										if (targetSoldier && targetSoldier instanceof Dead !== true) {
//										console.log('fire arrow!!!');
											//fire arrow
											targetSoldier.health -= enemySoldier.attack;
										}
									}

								}

							}
						}
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
							$scope.score++;

							var Soldier = new jobs[Math.floor(Math.random() * 4)]();  //Pick a random solider
							Soldier.x = x;
							Soldier.y = y;
							m[x][y] = Soldier;
							if ($scope.highScore < $scope.score) {
								localStorage['clashHightScore'] = $scope.score;
								$scope.highScore = $scope.score;
							}
						}
						else {
							m[x][y] = new Dead();
							m[x][y].x = x;
							m[x][y].y = y;

							$scope.totalNumSoldiers--;
							if ($scope.totalNumSoldiers <= 0) {
								$scope.gameOver = true;

							}

						}

					}
				}
			}

		};

		$scope.reportPos = function (soldier) {
			console.log(soldier.x, soldier.y);

		};

		$scope.go = function (soldier) {
//			if (evt.target.classList && evt.target.classList.contains('soldier')){
//				console.log('found');
//
//			}
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
