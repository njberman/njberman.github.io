/*
STATES:
	0 = PAUSED
	1 = RUNNING
	2 = WAITING (DEAD/NEXT LEVEL)
	3 = OUT OF LIVES

	L = LOAD.
*/

// function Menu(components) {

// 	this.addComponent = function(component) {
// 		this.components.add(component);
// 	}

// 	this.handleComponentParam = function(components) {
// 		var newComp = new Group();
// 		if(components instanceof Group) {
// 			return components;
// 		} else if(components instanceof Array) {
// 			components.forEach(function(c) {
// 				newComp.add(c);
// 			});
// 		} else if(components instanceof Sprite) {
// 		  newComp.add(components);
// 		}
// 		return newComp;
// 	}

// 	this.drawComponents = function() {
// 		drawSprites(this.components);
// 		this.components.forEach(function(c) {
// 		  c.handleTooltip();
// 		  if(c.tooltipActive) {
// 		    c.tooltip.display();
// 		  }
// 		});
// 	}

// 	this.handleComponentCallbacks = function() {
// 	}

// 	this.scaleAll = function(scale) {
// 	  this.components.forEach(function(c) {
// 	    c.scale = scale;
// 	  });
// 	}

// 	this.components = this.handleComponentParam(components);
// }

// function Button(x, y, image, callback, tooltip) {
// 	Sprite.apply(this, [x, y].concat([0, 0]));
//   this.scale = 0.5;
// 	this.mouseActive = true;
// 	this.tooltipActive = false;

// 	this.tooltip = tooltip;

// 	this.handleTooltip = function() {
// 		if(this.mouseIsOver) {
// 			this.tooltipActive = true;
// 		} else {
// 		  	this.tooltipActive = false;
// 		}
// 	}
// 	this.addImage(image);

// 	this.depth = allSprites.maxDepth() + 1;
// 	allSprites.add(this);

// 	this.callback = callback;

// }

// function Tooltip(x, y, image) {
// 	Sprite.apply(this, [x, y].concat([0, 0]));

// 	this.depth = allSprites.maxDepth() + 1;
// 	allSprites.add(this);

// 	this.addImage(image);
// }

// Button.prototype = Object.create(Sprite.prototype);
// Tooltip.prototype = Object.create(Sprite.prototype);


function Level(rows, cols, b_margin, offX, offY, filter, numcolors, background) {

	this.createLayout = function(rows, cols, b_margin, offX, offY, filter, colors) {
		for(var i = 0; i < rows; i++) {
			for(var j = 0; j < cols; j++) {
				if(filter(i, j)) {
					this.level_items.add(new Brick( offX + j * (40 + b_margin), offY + i * (20 + b_margin), 40, 20, this.chooseColor()));
				}
			}
		}

		this.level_items.add(new Wall(-40, 0, 40, height*2));
		this.level_items.add(new Wall(width+40, 0, 40, height*2));
		this.level_items.add(new Wall(0, -20, width*2, 20));
	}

	this.createLevelColors = function(numcolors) {
		var colors = [];
		for(var i = 0; i < numcolors; i++) {
			colors.push([randomGaussian(200, 55), randomGaussian(200, 55), randomGaussian(200, 55)]);
		}
		return colors;
	}

	this.bricksLeft = function() {
		var items = [];
		for(var i = 0; i < this.level_items.length; i++) {
			if(!(this.level_items[i] instanceof Wall)) items.push(this.level_items[i]);
		}
		return items.length;
	}

	this.chooseColor = function() {
		return this.colors[Math.floor(Math.random() * this.colors.length)];
	}

	this.drawLevel = function() {
		// Removed backgrounds because they mess with the general color scheme of the game.
		// if(this.background) { this.drawBackground(); };
		drawSprites(this.level_items);
		// drawSprites(this.enemy_list);
		drawSprites(this.ball_list);
    // this.enemyLogic();
	}

	this.enemyLogic = function() {
	  if(gameControl.state === 1) {
			this.enemy_list.forEach(function(e) {
				if(e instanceof Enemy) {
					if(frameCount % e.fireRate === 0) {
						e.shoot();
					}
				}
			});
		}
	}

	this.drawBackground = function() {
		var bg_width = this.background.width;
		for(var i = 0; i < Math.ceil(width / bg_width); i++) {
			image(this.background, i * bg_width, 0);
		}
	}

	this.getProperties = function() {
		return [this.rows, this.cols, this.b_margin, this.offX, this.offY, '' + this.filter, this.numcolors];
	}

	this.handleFilter = function(f) {
		if(typeof f === 'string') {
			return new Function('i', 'j', f.split('{')[1].split('}')[0]);
		} else {
			return f || function() { return true; };
		}
	}

	this.clearPowerups = function() {
		this.powerups.forEach(function(spr) {
				spr.remove();
		});
		gameControl.player.timers = gameControl.player.createTimers();
	}

	this.removeColor = function(c) {
		for(var i = 0; i < this.colors.length; i++) {
			if(this.colors[i] === c) {
				this.colors.splice(i, 1);
			}
		}
	}

	this.getLevelItem = function(i) {
		return this.level_items[i];
	}

	this.rows = rows;
	this.cols = cols;
	this.b_margin = b_margin;
	this.offX = offX;
	this.offY = offY;
	this.filter = this.handleFilter(filter);
	this.numcolors = numcolors || 8;

	this.background = background;

	this.colors = this.createLevelColors(this.numcolors);

	this.level_items = new Group();
	this.powerups = new Group();
	this.enemy_list = new Group();
	this.ball_list = new Group();

	this.createLayout(rows, cols, b_margin, offX, offY, this.filter, this.colors);

	this.ball_list.add(new Ball(500, 400, 15, 15, 5, 5, this.chooseColor()));

}

function GameControl() {

	this.createLevelList = function() {
		return [
		  // [rows, cols, brick margin, x-Offset, y-Offset, level filter function, number of colors]
		[9, 16, 4, (width / 2) - 15 * (40 + 4) / 2, 80, function(i, j) { return i === 0; }, 8],
		[9, 16, 4, (width / 2) - 15 * (40 + 4) / 2, 80, function(i, j) { return j === 0; }, 8],
		];
	}

	this.draw = function() {
		this.formatText(32, 'future', [255, 255, 255]);
		if(this.state === 1) {
			this.player.position.x = constrain(mouseX, this.player.width/2, windowWidth - this.player.width/2);

			this.player.handlePowerupTimers();

			this.checkBallHits();
			this.garbageCollection();

			this.player_list.overlap(this.currentLevel.powerups, this.player.triggerPowerup);

			this.player_list.collide(this.currentLevel.enemy_list, function(t, e) {
			  if(gameControl.player.lives > 0) {
			      gameControl.player.lives--;
			      e.remove();
			  } else {
			    gameControl.changeState(3);
			  }
			});

			// this.currentLevel.enemy_list.collide(this.currentLevel.level_items, function(t, i) {
			//   t.velocity.x *= -1;
			// });

		} else if(this.state === 0) {
			text('PAUSED', (width / 2) - 32 * 2, (height / 2));
		} else if(this.state === 2) {
			text('Click to Begin', (width / 2) - 32 * 4, (height / 2));
			this.formatText(32, 'bold', [120, 228, 24]);
			text('BrickBreakeR', (width / 2) - 32 * 5, (height / 4));
			if(!game_started) {
				this.formatText(20, 'bold', [51, 252, 32]);
				text('Collect the powerups, and try to keep the ball on screen!', width / 5, height / 1.5);
			}
		} else if(this.state === 3) {
			text('Game Over! \nPress \'R\' to Restart!', (width / 2) - 32 * 4, (height / 2));
		}
		this.currentLevel.drawLevel();

		drawSprites(this.player_list);
		drawSprites(this.currentLevel.powerups);

		this.drawText();

		// this.menu_list.forEach(function(m) {
		// 	m.drawComponents();
		// });

		if(frameCount % 360 === 0 && this.state === 1) {
			this.generatePowerup();
		}

		// if(frameCount % 1500 === 0 && this.state === 1) {
		// 	this.generateEnemy();
		// }

	}

	this.generatePowerup = function() {
		var powerup = this.powerup_list[this.powerup_generator.next()];
		this.currentLevel.powerups.add(new Powerup(random(width), random(250), powerup[0], powerup[1], random(4, 10)));
	}

	this.generateEnemy = function() {
		var lowestRow = this.currentLevel.rows * (20 + this.currentLevel.b_margin);
		this.currentLevel.enemy_list.add(new Enemy(40, lowestRow + random(20, 60), this.enemy_color_list[this.enemy_generator.next()]));
	}

	this.generateTip = function() {
		var tips = ['Press L to load a previous game!', 'Press F to enable \'Fun Mode\'!', 'Match the color of a brick & ball to blow up all of that color!'];
		return tips[Math.floor(Math.random() * tips.length)];
	}

	this.createPowerupsList = function() {
		return [
		[ [255, 0, 0], function(level) { level.ball_list.add(new Ball(random(width), 400, 15, 15, 5, random(4, 10), level.chooseColor())) }],
		[ [0, 255, 0], function(level) { gameControl.player.lives++; } ],
		[ [0, 0, 255], function(level) { gameControl.score += 5; } ],
		[ [255, 0, 255], function(level) { gameControl.player.timers['large'][0] += 500; } ],
		[ [128, 128, 255], function(level) { gameControl.player.timers['ycontrol'][0] += 500; } ],
		// [ [128, 60, 0], function(level) { gameControl.player.timers['large'][0] = 0; if(gameControl.player_list.length === 1) { gameControl.player_list.add(new Paddle(gameControl.player.position.x, gameControl.player.position.y, 150, gameControl.player.height)); } gameControl.player.timers['splitpaddle'][0] += 500; } ],
		[ [0, 128, 255], function(level) { gameControl.player.timers['slow'][0] += 500; gameControl.currentLevel.ball_list.forEach(function(b) { b.setSpeed(max_ball_speed / 2, b.getDirection()); }); }]
		];
	}

	this.garbageCollection = function() {
		this.currentLevel.powerups.forEach(function(s) {
			if(s.position.y >= height + 16) {
				s.remove();
			}
		});

		this.currentLevel.enemy_list.forEach(function(e) {
			if(e instanceof Bullet && e.position.y >= height + 10) {
				e.remove();
			}
		});
	}

	this.checkBallHits = function() {
		this.currentLevel.ball_list.forEach(function(b) {
			b.bounce(this.currentLevel.level_items, b.itemHit);
			b.bounce(this.player_list, function(b, p) {
				var swing = (b.position.x - p.position.x) / 3;
				b.setSpeed(max_ball_speed, b.getDirection() + swing);
				sounds['paddlehit'].play();
			});

			b.bounce(this.currentLevel.enemy_list, b.enemyHit);

			if(b.position.y >= height + b.height) {
				this.loseBall(b);
			}

		}, this);

	}

	this.nextLevel = function() {
	  if(this.fun_mode) sounds['level_up'].play();

		this.currentLevel.level_items.forEach(function(s) {
			s.remove();
		});

		this.levelList.shift();

		if(this.levelList.length === 0) {
			this.levelList.push(this.createLevel('random'));
		}
		this.currentLevel = this.createLevel(this.levelList[0]);
		this.changeState(2);
		this.level++;

		this.saveGame();
	}

	this.handlePause = function() {
		this.state === 0 ? this.changeState(1) : this.changeState(0);
	}

	this.loseBall = function(b) {
		if(this.currentLevel.ball_list.length === 1) {
			if(this.player.lives > 0) {
				this.currentLevel.clearPowerups();
				b.reset(500, 400);

				this.player.position.x = 500;
				this.changeState(2);
			} else {
			  sounds['game_over'].play();
				this.changeState(3);
			}
		} else {
			b.remove();
		}
		if(this.fun_mode) {
		  sounds['you_lose'].play();
		} else {
		  sounds['death'].play();
		}
	}

	this.changeState = function(s) {
		if(s === 0 || s === 2 || s === 3) {
			updateSprites(false);
			sounds['beat'].pause();
		} else {
			sounds['beat'].loop();
			updateSprites(true);
		}
		this.state = s;
	}

	this.drawText = function() {
		this.formatText(32, 'blocks', [255, 255, 255]);
		text('Score: '.concat(this.score), (width / 2) - (32 * 2), 32 * 1.1);
		text('Level: '.concat(this.level), 0 + (32 / 2), 32 * 1.1);
		text('Lives: '.concat(this.player.lives), width - (32 * 6), 32 * 1.1);
	}

	this.formatText = function(size, font, nfill) {
		textSize(size);
		textFont(fonts[font]);
		fill(nfill);
	}

	this.createLevel = function(args) {
		if(args === 'random') {
			return [Math.floor(random(4, 15)), Math.floor(random(4, 15)), random(3, 10), random(100, ((width / 2) - 15 * (40) / 2) + 400), random(100, 150), function(i, j) { return i % Math.floor(Math.random() * 4) === 0 || j % Math.floor(Math.random() * 4) === 0}, Math.ceil(random(4, 16))];
		} else {
			return new Level(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
		}
	}

	this.loadGame = function() {
		var userSave = window.localStorage.getItem('save');
		if(userSave !== undefined) {
			var info = JSON.parse(userSave);
			if(info['level'] > this.levelList.length) {
				this.levelList = new Group();
				this.currentLevel = this.createLevel(info['layout']);
			} else {
				this.levelList.splice(0, info['level']-1);
				this.currentLevel = this.createLevel(this.levelList[0]);
			}
			this.level = info['level'];
			this.score = info['score'];
			this.lives = info['lives'];

		}
	}

	this.saveGame = function() {
		window.localStorage.setItem('save', JSON.stringify({level: this.level, score: this.score, layout: this.currentLevel.getProperties(), lives: this.lives}));
	}

	this.getLevelItem = function(i) {
		return this.currentLevel.getLevelItem(i);
	}

	this.setFunMode = function(t) {
	  if(t === true) {
	    for(var i = 1; i < 8; i++) {
	      sounds['powerUp' + i] = sounds['power_up'];
	    }
	  } else {
	    for(var i = 1; i < 8; i++) {
	      sounds['powerUp' + i] = loadSound('assets/powerUp' + i + '.ogg');
	    }
	  }
	  this.fun_mode = t;
	}

	this.levelList = this.createLevelList();
	this.currentLevel = this.createLevel(this.levelList[0]);
	this.player_list = new Group();

	this.menu_list = [];

	this.player = new Paddle(100, (windowHeight - 35), 150, 40);
	this.player_list.add(this.player);

	this.score = 0;
	this.level = 1;

	this.state = 2;

	updateSprites(false);

	sounds['beat'].amp(0.4);
	sounds['beat'].rate(2);
	sounds['death'].amp(0.4);
// 	this.grey_panel = loadImage('assets/grey_panel.png');
// 	this.menu_list.push(new Menu([new Button(100, 100, loadImage('assets/yellow_ball.png'), function() { return true; }, new Tooltip(300, 300, this.grey_panel))]));

	this.powerup_list = this.createPowerupsList();
	this.enemy_color_list = ['green', 'blue', 'beige', 'yellow', 'pink'];

	this.powerup_generator = new Alias([0.375, 0.05, 0.21, 0.1, 0.165, 0.1]);
	// this.powerup_generator = new Alias([0.0, 0.0, 0.0, 0.5, 0.0, 0.5, 0.0]);
	this.enemy_generator = new Alias([0.3, 0.25, 0.25, 0.1, 0.1]);
	// this.enemy_generator = new Alias([0, 0, 0, 0, 1]);

  this.setFunMode(false);
}

var gameControl;
var sounds = {};
var fonts = {};
var images = {};
var max_ball_speed = 9;
var start_playing = false;
var game_started = false;

function preload() {
	sounds['paddlehit'] = loadSound('assets/paddlehit.ogg');
	sounds['brickhit'] = loadSound('assets/brickhit.ogg');
	sounds['beat'] = loadSound('assets/beat.ogg');
	sounds['death'] = loadSound('assets/death.ogg');
	sounds['ready'] = loadSound('assets/ready.ogg');
	sounds['set'] = loadSound('assets/set.ogg');
	sounds['go'] = loadSound('assets/go.ogg');

	sounds['power_up'] = loadSound('assets/power_up.ogg');
	sounds['level_up'] = loadSound('assets/level_up.ogg');
	sounds['you_lose'] = loadSound('assets/you_lose.ogg');
	sounds['game_over'] = loadSound('assets/game_over.ogg');

	fonts['blocks'] = loadFont('assets/blocks.ttf');
	fonts['future'] = loadFont('assets/future.ttf');
	fonts['bold'] = loadFont('assets/bold.ttf');

	images['green_ship'] = loadImage('assets/green_ship.png');
	images['beige_ship'] = loadImage('assets/beige_ship.png');
	images['yellow_ship'] = loadImage('assets/yellow_ship.png');
	images['blue_ship'] = loadImage('assets/blue_ship.png');
	images['pink_ship'] = loadImage('assets/pink_ship.png');

	// sounds['powerUp1'] = loadSound('assets/powerUp1.ogg');
	for(var i = 1; i < 8; i++) {
		// console.log('assets/powerUp' + i + '.ogg');
		sounds['powerUp'+i] = loadSound('assets/brickhit.ogg');
	}
	for(var i = 1; i < 4; i++) {
	  sounds['ship'+i] = loadSound('assets/ship'+i+'.ogg');
	}
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	gameControl = new GameControl();
}

function draw() {
	background(50);
	gameControl.draw();
}

function keyPressed() {
	switch(keyCode) {
		case 27: gameControl.handlePause(); break;
		case 82: allSprites.clear(); gameControl = new GameControl(); break;
		case 78: gameControl.nextLevel(); break;
		case 76: gameControl.loadGame(); break;
	}
}

function mousePressed() {
	if(gameControl.state === 2) {
		if(game_started === false) { game_started = true; };
	  if(gameControl.fun_mode) {
	    if(!start_playing) {
	      sounds['ready'].play();
	      start_playing = true;
	      setTimeout(function() {sounds['set'].play() }, 500);
	      setTimeout(function() {sounds['go'].play() }, 1100);
  		  setTimeout(function() { gameControl.changeState(1); }, 1500);
  		  setTimeout(function() {start_playing = false }, 1501);
	    }
	  } else {
	    gameControl.changeState(1);
	  }

	}
}
