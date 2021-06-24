class Platform extends Ground {
  constructor(x, y, width, height, platformImage) {
    super(x, y, width, height);
    this.platformImage = platformImage;
  }
  show(){
    var pos = this.body.position;
    var angle = this.body.angle;

    push();
    translate(pos.x, pos.y);
    rotate(angle);
    rectMode(CENTER);
    imageMode(CENTER);
    image(this.platformImage, 0, 0, this.width, this.height);
    pop();
  }
}
