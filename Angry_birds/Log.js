class Log {
    constructor(x, y, height, angle,logImage) {
      var options = {
          'restitution':0.8,
          'friction':1.0,
          'density':1.0
      }
      this.body = Bodies.rectangle(x, y, 20, height, options);
      this.width = 20;
      this.height = height;
      this.logImage = logImage;
      Matter.Body.setAngle(this.body, angle);
      World.add(world, this.body);
    }
    show(){
      var pos =this.body.position;
      var angle = this.body.angle;
      push();
      translate(pos.x, pos.y);
      rotate(angle);
      rectMode(CENTER);
      imageMode(CENTER)
      image(this.logImage,0, 0, this.width, this.height);
      pop();
    }
  };
