class Obstacle {
  constructor(x, y, width, height, obstacleImage) {
    var options = {
      'restitution':0.8,
      'friction' : 1.0,
      'density' : 0.3
    }
    this.body = Bodies.rectangle(x, y, width, height, options);
    this.width = width;
    this.height = height;
    this.obstacleImage = obstacleImage;
    World.add(world, this.body);
  }
  show(){
    var pos =this.body.position;
    var angle = this.body.angle;
    push();
    translate(pos.x, pos.y);
    rotate(angle);
    rectMode(CENTER);
    imageMode(CENTER);
    image(this.obstacleImage,0, 0, this.width, this.height);
    pop();
  }
};
