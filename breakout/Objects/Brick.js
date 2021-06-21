function Brick(x, y, w, h, c) {
	Sprite.apply(this, arguments);
	this.immovable = true;

	this.shapeColor = c;

	this.update = function() {
		return false;
	}
}

Brick.prototype = Object.create(Sprite.prototype);
