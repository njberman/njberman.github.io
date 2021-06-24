const { Engine, World, Bodies, Body, Mouse, MouseConstraint, Constraint, Composite, Detector} = Matter;
const CANVAS_WIDTH = 1280,
      CANVAS_HEIGHT = 720;

var engine, world;
var ground, base; // All static bodies
var box1, box2,box3,box4, box5; // box obstacles objects
var log1, log2, log3, log4; // Recatngle obstacles objects
var enemy1, enemy2; // Enemy objects
var bird; //Bird object
var bgImage,groundImage, baseImage, birdImage, boxWood, logWood, enemyImage; // All Sprite's
var mConstraint;
var slingshot;
var platform, platformImage; // Platform object
var sling1, sling2, slingImage1, slingImage2, slingImage3 //Sling and Catapult
var pressed = false;
var released = false;

var bird_pos = [];
var birdState = "fly"
var smokeImage;

var enemy1State = "alive";
var enemy2State = "alive";
var score = 0;

var time, timezone;
//Change location and continent here
var continent = "Asia"
var area = "Kolkata"
var bgColor = "white"

function preload(){
  bgImage = loadImage('sprites/bg.png');
  groundImage = loadImage('sprites/ground.png');
  baseImage = loadImage('sprites/base.png')
  birdImage = loadImage('sprites/bird.png');
  boxWood = loadImage('sprites/wood1.png');
  logWood = loadImage('sprites/wood2.png');
  enemyImage = loadImage('sprites/enemy.png');
  platformImage = loadImage('sprites/platform.png');
  slingImage1 = loadImage('sprites/sling1.png');
  slingImage2 = loadImage('sprites/sling2.png');
  slingImage3 = loadImage('sprites/sling3.png');
  smokeImage = loadImage('sprites/smoke.png');

  let url = "http://worldtimeapi.org/api/timezone/" + continent + "/" + area;
  httpGet(url, true, function(response) {
      timezone = JSON.parse(response);
      time = timezone.datetime.slice(11,13)
      time = parseInt(time)
  });
}
function setup(){
  const canvas =  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  engine = Engine.create();
  world = engine.world;
  
  // Ground object
  ground = new Ground(width/2, height, width, 50, groundImage);

  // Base for obstacles in brown color
  base = new Base(width - 250,height-35, 350, 20, baseImage)

  // left box obstacle
  box1 = new Obstacle(width-350,height-80,80,80,boxWood);

  // Lower Middle Enemy
  enemy1 = new Enemy(width-250, height-90,60,60,enemyImage);

  // Right box Obstacle
  box2 = new Obstacle(width-150,height-80,80,80,boxWood);

  // Lower Rectangle obstacle
  log1 = new Log(width-250,height-120,280,PI/2,logWood);

  // Middle box obstacle
  box3 = new Obstacle(width-350,height-125,80,80,boxWood);

  // Middle Enemy
  enemy2 = new Enemy(width-250,height-125,60,60,enemyImage);

  // Right box Obstacle
  box4 = new Obstacle(width-150,height-125,80,80,boxWood);

  // Upper Rectangle Obstacle
  log2 = new Log(width-250,height-225,280,PI/2,logWood);

  // Upper Middle box
  box5 = new Obstacle(width-250,height-250,80,80,boxWood);

  // Left Rod
  log3 = new Log(width-320, height-260,150,PI/7,logWood)

  // Right Rod
  log4= new Log(width-180,height-260,150, -PI/7,logWood);

  // Bird Object
  bird = new Bird(270,225,50,50,birdImage);

  // Catapult
  sling1 = new Catapult(270,300,8, 2, slingImage1); // Octagon
  sling2  = new Catapult(244,255, 6, 2, slingImage2); // Hexagon

  // SlingShot for catapult
  slingshot = new SlingShot(270, 225, bird.body);


  const mouse = Mouse.create(canvas.elt);
  const options = {
    mouse: mouse
  }

  // A fix for HiDPI displays
  mouse.pixelRatio = pixelDensity();
  mConstraint = MouseConstraint.create(engine, options)
  World.add(world, mConstraint);

  //Platform for catapult
  platform = new Platform(100, 545, 400,300,platformImage);

}


function draw(){
  changeBg()
//   background(bgColor);
  background(bgImage);
  Matter.Engine.update(engine);
  noStroke();
  textSize(35)
  fill("white")
  text("Score  " + score, width-300, 50)

  ground.show();

  base.show();

  box1.show();
  if(enemy1State === "alive"){
    enemy1.show();
  }
  box2.show();

  log1.show();

  box3.show();
  if(enemy2State === "alive"){
    enemy2.show();
  }
  box4.show();

  log2.show();

  box5.show();
  log3.show();
  log4.show();

  platform.show();


  sling1.show();
  bird.show();

  if(mousePressed){
    if(pressed == true){
      slingshot.show();
    }
  }

  sling2.show();

  if(mouseReleased){
    if(released == true){
      Score();
      if(birdState === "fly"){
        bird_pos.push(bird.body.position)
      }
      var Groundcollision = Matter.SAT.collides(bird.body, ground.body);
      var Log1collision =  Matter.SAT.collides(bird.body, log1.body);
      var Log2collision =  Matter.SAT.collides(bird.body, log2.body);
      var Log3collision =  Matter.SAT.collides(bird.body, log3.body);
      var Basecollision =  Matter.SAT.collides(bird.body, base.body);
      var Square1Collision = Matter.SAT.collides(bird.body, box1.body);
      var Square3Collision = Matter.SAT.collides(bird.body, box3.body);

      if(Groundcollision.collided){
        birdState = "land";
      }
      else if(Log1collision.collided){
        birdState = "land";
      }
      else if(Log2collision.collided){
        birdState = "land"
      }
      else if(Log3collision.collided){
        birdState = "land";
      }
      else if(Basecollision.collided){
        birdState = "land";
      }
      else if(Square1Collision.collided){
        birdState = "land";
      }
      else if(Square3Collision.collided){
        birdState = "land";
      }

      if(birdState === "land"){
        var num = 20;
        for(let i = 0; i<bird_pos.length; i++){
            if(bird_pos[i].y > 200){
              image(smokeImage,bird_pos[i].x-(num + 40), bird_pos[i].y-num, 10,10)
              num+=16
            }
        }
        birdSate = "done"
      }

    }
  }


}

function mouseReleased() {
  pressed = false;
  setTimeout(() => {
    slingshot.fly();
    released = true;

  }, 100);
}

function mousePressed(){
  pressed = true;
}



function Score(){
  // Vanish the enemy1
  if(enemy1.body.speed > 10.0 && enemy1State === "alive"){
    console.log(enemy1.body.speed,"1");
    enemy1.removeFromWorld();
    setTimeout(()=>{
      enemy1State = "vanish";
    },400)
  }

  if(score < 1000 && enemy1State === "vanish"){
    while(true){
      score+=5
      if(score===1000){
        enemy1State = "dead";
      }
      break
    }
  }
  else if((score >=1000 && score < 2000) && enemy1State === "vanish"){
    while(true){
      score+=5
      if(score === 2000){
        enemy2State  = "dead"
      }
      break
    }
  }


  // Vanish the enemy2
  if(enemy2.body.speed > 10.0 && enemy2State === "alive"){
    console.log(enemy2.body.speed,"2");
    enemy2.removeFromWorld();

    setTimeout(()=>{
      enemy2State = "vanish";
    },400);
  }

  if(score < 1000 && enemy2State === "vanish"){
    while(true){
      score+=5;
      if(score===1000){
        enemy2State = "dead"
      }
      break
    }
  }
  else if((score >=1000 && score < 2000) && enemy2State === "vanish"){
    while(true){
      score+=5;
      if(score === 2000){
        enemy2State === "dead"
      }
      break
    }
  }
}


function changeBg(){
  if(time >= 1 && time <= 4){
    bgColor = "green"; // Midnight
  }
  else if(time >=5 && time <= 11){
    bgColor = "orange"; // Morning
  }
  else if(time >= 12 && time <= 16){
    bgColor = "blue"; // Afternoon
  }
  else if(time >=17 && time <=20){
    bgColor = "yellow"; // evening
  }
  else if(time >=21 && time <=24){
    bgColor = "red"; //night
  }
}
