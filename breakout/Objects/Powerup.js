function Powerup(x, y, c, cb, vY) {
	Sprite.apply(this, arguments);
	this.setCollider('circle', 0, 0, 16);
	this.draw = function() {
		fill(this.c);
		ellipse(0, 0, 16, 16);
	}
	this.callback = cb;
	this.c = c;

	this.setVelocity(0, vY);

	this.depth = allSprites.maxDepth() + 1;
	allSprites.add(this);
}

Powerup.prototype = Object.create(Sprite.prototype);
