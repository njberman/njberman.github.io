class Base extends Ground {
  constructor(x, y, width, height,baseImage) {
    super(x, y, width, height);
    this.baseImage = baseImage;
  };

  show(){
    var pos = this.body.position;
    var angle = this.body.angle;

    push();
    translate(pos.x, pos.y)
    rotate(angle);
    rectMode(CENTER);
    imageMode(CENTER);
    image(this.baseImage,0,0,this.width, this.height)
    pop()
  }
}
