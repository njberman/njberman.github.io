function Wall(x, y, w, h) {
	Sprite.apply(this, arguments);
	this.immovable = true;
}

Wall.prototype = Object.create(Sprite.prototype);