let scale = 24;
const gridWidth = 28;
const gridHeight = 31;

let level = 1;
let pauseTime = 0;
let immunity = false;
let scatter = true;
let map;
let setFrameRate = 60;
let cpuLoad = new Array(setFrameRate * 5).fill(0);
let ghosts = [];
let frame = 0;
let xOff = 0;
let yOff = 0;
let showPath = false;

function setup()
{
  // Adjust the scale to get it to fit the screen
  let scaleX = windowWidth / gridWidth;
  let scaleY = windowHeight / gridHeight;
  scale = min(scaleX, scaleY);

  yOff = (windowHeight - scale * gridHeight) / 2;
  xOff = (windowWidth - scale * gridWidth) / 2;
  
  // createCanvas(gridWidth * scale, gridHeight * scale);
  createCanvas(windowWidth, windowHeight);
  frameRate(setFrameRate);
  map = new Map(scale, xOff, yOff);
  map.show();
  pacman = new Pacman(scale, xOff, yOff, createVector(13.5, 23), level, frightenGhosts);
  bonus = new Bonus(createVector(13.5, 17), scale, xOff, yOff, 100);
  reset();
  // noLoop();
}

function windowResized() 
{
  setup();
}

function reset()
{
  ghosts = [];
  ghosts[0] = new Ghost(scale, xOff, yOff, map, 'rgb(254, 36, 1)', createVector(13.5,11), createVector(25,-3), level);
  ghosts[1] = new Ghost(scale, xOff, yOff, map, 'rgb(254, 178, 178)', createVector(13.5, 14), createVector(2,-3), level);
  ghosts[2] = new Ghost(scale, xOff, yOff, map, 'rgb(0, 222, 223)', createVector(11.5, 14), createVector(27,32), level);
  ghosts[3] = new Ghost(scale, xOff, yOff, map, 'rgb(254, 160, 0)', createVector(15.5, 14), createVector(0,32), level);
  pacman.reset();
  pauseTime = 0;
  frame = 0;
}

function changeDirection(keyCode)
{
  switch (keyCode)
  {
    case 0:
      pacman.changeDirection(createVector(0, -1));
      break;

    case 1:
      pacman.changeDirection(createVector(0, 1));
      break;

    case 2:
      pacman.changeDirection(createVector(1, 0));
      break;

    case 3:
      pacman.changeDirection(createVector(-1, 0));
      break;
  }
}

function keyPressed() {
  // loop();
  console.log(keyCode);
  switch (keyCode)
  {
    case UP_ARROW:
      pacman.changeDirection(createVector(0, -1));
      break;

    case DOWN_ARROW:
      pacman.changeDirection(createVector(0, 1));
      break;

    case RIGHT_ARROW:
      pacman.changeDirection(createVector(1, 0));
      break;

    case LEFT_ARROW:
      pacman.changeDirection(createVector(-1, 0));
      break;

    case 73: //I
      toggleImmunity();
      break;

    case 80: //P
      showPath = !showPath;
      break;
  }
}

function getEverything ()
{
  everything = {
    map:map.mapFile,
    blinkPosx:ghosts[0].pos.x,
    blinkPosy:ghosts[0].pos.y,
    pinkPosx:ghosts[1].pos.x,
    pinkPosy:ghosts[1].pos.y,
    inkPosx:ghosts[2].pos.x,
    inkPosy:ghosts[2].pos.y,
    clydePosx:ghosts[3].pos.x,
    clydePosy:ghosts[3].pos.y,
    frightened:ghosts[0].frightened,
    pacPosx:pacman.pos.x,
    pacPosy:pacman.pos.y,
    pacDead:pacman.dead,
    pacLives:pacman.lives
  };

  return everything;
}

function frightenGhosts ()
{
  for (i = 0; i < ghosts.length; i++)
  {
    ghosts[i].setFrightTime(6);
  }
}

function moveGhosts()
{
  posx = round(pacman.pos.x);
  posy = round(pacman.pos.y);

  ghosts[0].move(map, createVector(posx, posy), showPath);

  if (!pacman.facing.equals(createVector(0, -1)))
  {
    ghosts[1].move(map, createVector(posx, posy).add(pacman.facing.copy().mult(4)), showPath);

    var inkyTarget1 = createVector(posx, posy).add(pacman.facing.copy().mult(2));
    var inkyTarget2 = inkyTarget1.copy().sub(ghosts[0].pos.copy());
    inkyTarget1.add(inkyTarget2);
  }
  else
  {
    ghosts[1].move(map, createVector(posx, posy).add(createVector(-4, -4)), showPath);

    var inkyTarget1 = createVector(posx, posy).add(createVector(-2, -2));
    var inkyTarget2 = inkyTarget1.copy().sub(ghosts[0].pos.copy());
    inkyTarget1.add(inkyTarget2);
  }

  var inkyTarget1 = createVector(posx, posy).add(pacman.facing.copy().mult(2));
  var inkyTarget2 = inkyTarget1.copy().sub(ghosts[0].pos.copy());
  inkyTarget1.add(inkyTarget2);

  ghosts[2].move(map, createVector(round(inkyTarget1.x), round(inkyTarget1.y)), showPath);

  if (ghosts[3].pos.copy().dist(createVector(posx, posy)) > 8)
  {
    ghosts[3].move(map, createVector(posx, posy), showPath);
  }
  else
  {
    ghosts[3].move(map, createVector(0, 32), showPath);
  }
}

function showGhosts()
{
  posx = round(pacman.pos.x);
  posy = round(pacman.pos.y);

  for (i = 0; i < ghosts.length; i++)
  {
    ghosts[i].show();

    if ((posx == round(ghosts[i].pos.x) && posy == round(ghosts[i].pos.y)) ||
        (pacman.pos.dist(ghosts[i].pos) < (1/8)))
    {
      if (ghosts[i].frightened)
      {
        ghosts[i].kill();
      }
      else if (!ghosts[i].dead && !immunity)
      {
        pacman.kill();
        pauseTime = frame + 5 * setFrameRate;
      }
    }
  }
}

function releaseNewGhosts(pacman)
{
  if (pacman.getPelletsEaten() >= 0 && ghosts[1].housed)
  {
    //Release Pinky
    ghosts[1].releaseGhost();
  }
  else if (pacman.getPelletsEaten() >= 30 && ghosts[2].housed)
  {
    //Release Inky
    ghosts[2].releaseGhost();
  }
  else if (pacman.getPelletsEaten() >= 60 && ghosts[3].housed)
  {
    //Release Clyde
    ghosts[3].releaseGhost();
  }
}

function checkGhostMode()
{
  var time = frame / setFrameRate;

  if (time < 7 || (27 < time && time < 34) || (54 < time && time < 61) || (81 < time && time < 88))
  {
    scatter = true;
    if (!ghosts[0].scatter)
    {
      for (i = 0; i < ghosts.length; i++)
      {
        ghosts[i].ghostScatter();
      }
    }
  }
  else
  {
    scatter = false;
    if (ghosts[0].scatter)
    {
      for (i = 0; i < ghosts.length; i++)
      {
        ghosts[i].ghostHunt();
      }
    }
  }
}

function bonusLogic (pacman)
{
  if (70 == pacman.pelletsEaten || 170 == pacman.pelletsEaten)
  {
    bonus.setBonusTime(10 - random(1));
  }

  if (bonus.bonusTime && (pacman.pos.dist(bonus.pos) < (1 / 2)))
  {
    pacman.score += bonus.value;
    bonus.bonusEaten();
  }

  bonus.show();
}

function toggleImmunity()
{
  immunity = !immunity;
  message = 'Immunity ' + ((immunity) ? 'enabled' : 'disabled');
  console.log(message);
}

function touchMoved(event) {
  console.log('touchMoved');
  console.log(event);
}

function draw()
{
  for (var loop = 0; loop < 1; loop++)
  {
    var startTime = millis();
    background(0);
    map.show();

    if (0 == pauseTime)
    {
      moveGhosts();
      pacman.move(map);
      showGhosts();
      releaseNewGhosts(pacman);
      checkGhostMode();
    }
    if ((pauseTime > 0) && (pauseTime < frame))
    {
      reset();
    }

    if (pacman.lives < 0 ||
        (pacman.getPowerPelletsEaten() == map.getstartingPowerPelletCount() &&
        pacman.getPelletsEaten() == map.getstartingPelletCount()))
    {
      setup();
      reset();
    }

    bonusLogic(pacman);
    pacman.show();
    frame++;
  }

  var renderTime = (millis() - startTime) / 1000;
  cpuLoad.push(round( renderTime * 100 / (1/setFrameRate)));
  cpuLoad.shift();

  // document.getElementById("position").innerHTML = "PosX = " + round((mouseX / scale) - 0.5).toString() + " PosY = " + round((mouseY / scale) - 0.5).toString();
  // document.getElementById("score").innerHTML = "Score: " + pacman.score;
  // document.getElementById("lives").innerHTML = "Lives: " + pacman.lives;
  // // document.getElementById("level").innerHTML = "Level: " + level;
  // // document.getElementById("ghostMode").innerHTML = "Ghost Mode: " + ((scatter)?"Scatter":"Hunt");
  // document.getElementById("immunity").innerHTML = "Immunity " + ((immunity)?"On":"Off");
  // document.getElementById("time").innerHTML = "Time = " + round(millis() / 1000).toString();
  // document.getElementById("renderTime").innerHTML = "Load = " + round( renderTime * 100 / (1/setFrameRate)) + "%";
}
