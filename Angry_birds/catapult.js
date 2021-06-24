class Catapult {
  constructor(x, y, sides, radius, slingImage) {
    var options = {
      isStatic : true
    };
    this.body = Bodies.polygon(x, y, sides, radius, options);
    World.add(world, this.body);
    this.sides = sides;
    this.radius = radius;
    this.slingImage = slingImage;
  }

  show(){
    var pos  = this.body.position;
    var angle = this.body.angle;

    push();
    translate(pos.x, pos.y);
    rotate(angle);
    rectMode(CENTER);
    imageMode(CENTER);
    image(this.slingImage,0,0,this.width, this.height)
    pop();
  }
}
