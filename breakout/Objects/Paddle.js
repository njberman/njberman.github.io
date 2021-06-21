function Paddle(x, y, w, h, l) {
	Sprite.apply(this, arguments);
	this.immovable = true;
	this.lives = l || 3;

  // Put createTimers into a function for quicker resetting of timers.
	this.createTimers = function() {
	  return {
  		large: [0, function(paddle) { paddle.width = 250; }, function(paddle) { paddle.width = 150; }, false],
  		ycontrol: [0, function(paddle) { paddle.position.y = constrain(mouseY, paddle.height / 2, height - paddle.height / 2)}, function(paddle) { paddle.position.y = height - 35; }, false],
  		// splitpaddle: [0, function(paddle) { gameControl.player_list[1].position.x = paddle.position.x - 250; gameControl.player_list[1].position.y = paddle.position.y; }, function(paddle) { if(gameControl.player_list.length > 1) { gameControl.player_list[1].remove(); } }, false],
  		slow: [0, function(paddle) { max_ball_speed = 4.5; }, function(paddle) { max_ball_speed = 9; }, false]
	  }
	}

	this.triggerPowerup = function(t, p) {
		if(p instanceof Powerup) {
			sounds['powerUp'+ Math.ceil(Math.random() * 7)].play();
			p.remove();
			p.callback(gameControl.currentLevel);
		}
	}

	this.handlePowerupTimers = function() {
		var timerKeys = Object.keys(this.timers);
		for(var i = 0; i < timerKeys.length; i++) {
			var timerItem = this.timers[timerKeys[i]];
			if(timerItem[0] > 0) {
			  	timerItem[3] = false;
				timerItem[1](this);
				timerItem[0]--;
			} else if(timerItem[3] === false) {
				timerItem[2](this);
				timerItem[3] = true;
			}
		};
		this.setCollider('rectangle', 0, 0, this.width, this.height);
	};

	this.timers = this.createTimers();

	this.depth = allSprites.maxDepth() + 1;
	allSprites.add(this);
}

Paddle.prototype = Object.create(Sprite.prototype);
