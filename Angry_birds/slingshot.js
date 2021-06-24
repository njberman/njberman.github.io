class SlingShot {
  constructor(x, y, body) {
    const options = {
      //Elastic
      pointA: {
        x: x,
        y: y
      },
      bodyB: body,
      stiffness: 0.1
    }
    this.sling = Constraint.create(options);
    World.add(world, this.sling);
    this.body = body;
  }

  fly() {
    this.sling.bodyB = null;
  }

  show() {
    if (this.sling.bodyB) {
      stroke("#301A03");
      if(this.body.position.x > 210 && this.body.position.x <= 350){  
        strokeWeight(10)
      }else{
        strokeWeight(5)
      }
      
      const posA = this.sling.pointA;
      const posB = this.sling.bodyB.position;
      if(this.body.position.x > 265){
        line(posB.x + 25, posB.y, posA.x + 5, posA.y + 5);
        bird.show();
        image(slingImage3, posB.x +25, posB.y-10,15,30)
        line(posB.x + 25, posB.y+5, posA.x - 30, posA.y);
      }else{
        line(posB.x - 20, posB.y, posA.x + 5, posA.y + 5);
        bird.show();
        image(slingImage3, posB.x-30, posB.y-10,15,30)
        line(posB.x -20, posB.y+5, posA.x - 30, posA.y);
      }

    }
  }

  attach(body) {
    this.sling.bodyB = body;
  }

}
