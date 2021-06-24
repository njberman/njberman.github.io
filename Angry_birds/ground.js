class Ground {
  constructor(x, y, width, height, groundImage) {
    var options ={
      isStatic : true
    }
    this.body = Bodies.rectangle(x,y, width, height, options);
    this.width = width;
    this.height = height;
    this.groundImage = groundImage;
    World.add(world, this.body);
  };

  show(){
    var pos = this.body.position;
    var angle = this.body.angle;

    push();
    translate(pos.x, pos.y)
    rotate(angle);
    rectMode(CENTER);
    imageMode(CENTER);
    image(this.groundImage,0,0,this.width, this.height)
    pop()
  }
}
