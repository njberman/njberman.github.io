class Ghost
{
  constructor (scale, xOff, yOff, map, color, pos, scatterTarget, level)
  {
    this.scale = scale;
    this.xOff = xOff;
    this.yOff = yOff;
    this.color = color;
    this.pos = pos;
    this.scatterTarget = scatterTarget;
    this.current = pos;
    this.dir = createVector(-1, 0);
    this.previousDir = this.dir;
    this.animateSpeed = 0.01;
    this.baseSpeed = 1/6;
    this.level = level;
    this.frightTime = 0;
    this.frightened = false;
    this.scatter = true;
    this.dead = false;
    this.housed = map.getTileTypeVector(pos) == 'H';
    this.release = false;
    this.frightenedCount = 0;

    if (this.housed)
    {
      this.dir = createVector(0,1);
    }

    if (1 == level)
    {
      this.speed = this.baseSpeed * 0.75;
    }
    else if (2 <= level && level <= 4)
    {
      this.speed = this.baseSpeed * 0.85;
    }
    else if (5 <= level && level <= 20)
    {
      this.speed = this.baseSpeed * 95;
    }
    else if (level >= 21)
    {
      this.speed = this.baseSpeed * 0.95;
    }
  }

  getPos()
  {
    return this.pos;
  }

  getColor()
  {
    return this.color;
  }

  setFrightTime(time)
  {
    this.frightTime = frameCount + 60 * time;
    this.dir.mult(-1);
    this.frightened = true;
    this.frightenedCount++;

    if (1 == level)
    {
      this.speed = this.baseSpeed * 0.5;
    }
    else if (2 <= level && level <= 4)
    {
      this.speed = this.baseSpeed * 0.55;
    }
    else if (5 <= level && level <= 16)
    {
      this.speed = this.baseSpeed * 60;
    }
    else if (level == 18)
    {
      this.speed = this.baseSpeed * 60;
    }
    else
    {
      this.speed = this.baseSpeed;
    }
  }

  kill()
  {
    this.frightened = false;
    this.dead = true;
  }

  moveHoused ()
  {
    var x = round(this.pos.x);
    var y = round(this.pos.y);

    if (map.getTileTypeVector(this.pos.copy().add(this.dir)) == 'W')
    {
      this.dir.mult(-1);
    }

    this.dir.normalize();
    this.pos.add(this.dir.copy().mult(this.speed/2));

    return;
  }

  ghostScatter()
  {
    this.scatter = true;
    this.dir.mult(-1);
  }

  ghostHunt()
  {
    this.scatter = false;
  }

  releaseGhost ()
  {
    this.release = true;
    this.housed = false;
  }

  moveRelease(map)
  {
    if (abs(map.getHouseCenter().x - this.pos.x) <= (this.speed / 4))
    {
      this.pos.x = map.getHouseCenter().x;

      if (this.pos.dist(createVector(this.pos.x, round(this.pos.y))) < (this.speed / 2) && map.getTileTypeVector(this.pos) == " ")
      {
        this.release = false;
        this.dir = createVector(-1, 0);
      }
      else
      {
        this.dir = createVector(0, -1);
      }
    }
    else
    {
      this.dir = createVector(Math.sign(map.getHouseCenter().x - this.pos.x), 0);
    }

    this.dir.normalize();
    this.pos.add(this.dir.copy().mult(this.speed/2));
  }

  moveHunt(map, target)
  {
    // If we are going through the tunnel
    if (this.pos.x <= -1)
    {
      this.pos = createVector(28, 14);
      this.dir = createVector(-1, 0);
    }
    else if (this.pos.x >= 28)
    {
      this.pos = createVector(-1, 14);
      this.dir = createVector(1, 0);
    }

    var x = round(this.pos.x);
    var y = round(this.pos.y);

    //If we are on a tunnel path
    if (map.getTileType(x, y) == 'T' && this.frightTime < frameCount)
    {
      if (1 == level)
      {
        this.speed = this.baseSpeed * 0.4;
      }
      else if (2 <= level && level <= 4)
      {
        this.speed = this.baseSpeed * 0.85;
      }
      else if (5 <= level && level <= 20)
      {
        this.speed = this.baseSpeed * 95;
      }
      else if (level >= 21)
      {
        this.speed = this.baseSpeed * 0.95;
      }
    }
    else if (this.frightTime < frameCount)
    {
      if (1 == level)
      {
        this.speed = this.baseSpeed * 0.75;
      }
      else if (2 <= level && level <= 4)
      {
        this.speed = this.baseSpeed * 0.85;
      }
      else if (5 <= level && level <= 20)
      {
        this.speed = this.baseSpeed * 95;
      }
      else if (level >= 21)
      {
        this.speed = this.baseSpeed * 0.95;
      }
    }

    // If we are at an intersection, check for a new changeDirection
    if (map.isIntersection(x, y) && this.pos.dist(createVector(x, y)) < (this.speed / 2))
    {
      this.pos = createVector(x, y);

      var minDistance = Number.MAX_SAFE_INTEGER;
      var testDistance = 0;
      var newDir = createVector(0, 0);

      // Calculate distances
      testDistance = this.pos.copy().add(createVector( 0,  1)).dist(target.copy());
      testDistance += (map.getTileType(x + 0, y + 1) == 'W')?Number.MAX_SAFE_INTEGER:0;
      testDistance += (map.ghostWalls.includes((x + 0).toString() + "," + (y + 1).toString()))?Number.MAX_SAFE_INTEGER:0;
      if (testDistance < minDistance && !this.dir.equals(0, -1))
      {
        minDistance = testDistance;
        newDir = createVector(0, 1);
      }

      testDistance = this.pos.copy().add(createVector( 1,  0)).dist(target.copy());
      testDistance += (map.getTileType(x + 1, y + 0) == 'W')?Number.MAX_SAFE_INTEGER:0;
      testDistance += (map.ghostWalls.includes((x + 1).toString() + "," + (y + 0).toString()))?Number.MAX_SAFE_INTEGER:0;
      if (testDistance < minDistance && !this.dir.equals(-1, 0))
      {
        minDistance = testDistance;
        newDir = createVector(1, 0);
      }

      testDistance = this.pos.copy().add(createVector(-1,  0)).dist(target.copy());
      testDistance += (map.getTileType(x - 1, y + 0) == 'W')?Number.MAX_SAFE_INTEGER:0;
      testDistance += (map.ghostWalls.includes((x - 1).toString() + "," + (y + 0).toString()))?Number.MAX_SAFE_INTEGER:0;
      if (testDistance < minDistance && !this.dir.equals(1, 0))
      {
        minDistance = testDistance;
        newDir = createVector(-1, 0);
      }

      testDistance = this.pos.copy().add(createVector( 0, -1)).dist(target.copy());
      testDistance += (map.getTileType(x + 0, y - 1) == 'W')?Number.MAX_SAFE_INTEGER:0;
      testDistance += (map.ghostWalls.includes((x + 0).toString() + "," + (y - 1).toString()))?Number.MAX_SAFE_INTEGER:0;
      if (testDistance < minDistance && !this.dir.equals(0, 1))
      {
        minDistance = testDistance;
        newDir = createVector(0, -1);
      }

      this.dir = newDir;
    }

    // If we are in a corner
    else if (map.getTileTypeVector(this.pos.copy().add(this.dir)) == 'W' && this.pos.dist(createVector(x, y)) <= (this.speed / 2))
    {
      // Chose a direction
      this.pos = createVector(x, y);
      this.previousDir = this.dir;

      this.dir = createVector(1, 0).mult((map.getTileType(x + 1, y) != 'W')?1:0);
      this.dir.add(createVector(-1, 0).mult((map.getTileType(x - 1, y) != 'W')?1:0));
      this.dir.add(createVector(0, 1).mult((map.getTileType(x, y + 1) != 'W')?1:0));
      this.dir.add(createVector(0, -1).mult((map.getTileType(x, y - 1) != 'W')?1:0));
      this.dir.add(this.previousDir);
    }

    this.dir.normalize();
    this.pos.add(this.dir.copy().mult(this.speed));
  }

  move(map, target, debug = false)
  {

    if (this.housed)
    {
      this.moveHoused();
      return;
    }
    else if (this.release)
    {
      this.moveRelease(map);
      return;
    }
    else if (this.scatter)
    {
      this.moveHunt(map, this.scatterTarget);
      if (debug)
      {
        strokeWeight(scale / 12);
        stroke(this.color);
        line((this.pos.x + 0.5) * this.scale + this.xOff, 
            (this.pos.y + 0.5) * this.scale + this.yOff, 
            (this.scatterTarget.x + 0.5) * this.scale + this.xOff, 
            (this.scatterTarget.y + 0.5) * this.scale + this.yOff);
      }
    }
    else if (this.frightened)
    {
      if (false)
      {
        map.houseCenter;
      }
      else
      {
        this.moveHunt(map, createVector(this.pos.x + random(-1, 1), this.pos.y + random(-1, 1)));
      }
    }
    else
    {
      this.moveHunt(map, target);
      if (debug)
      {
        strokeWeight(scale / 12);
        stroke(this.color);
        line((this.pos.x + 0.5) * this.scale + this.xOff, 
            (this.pos.y + 0.5) * this.scale + this.yOff, 
            (target.x + 0.5) * this.scale + this.xOff, 
            (target.y + 0.5) * this.scale + this.yOff);
      }
      return;
    }

    if (this.dir.x && this.dir.y)
    {
      console.log("Ghost on the run");
    }
  }

  show ()
  {
    noStroke();
    fill(this.color);

    let triangles = (sin(millis() * this.animateSpeed) > 0);

    //TODO: Remove this as it is for testing
    if (this.frightTime < frameCount)
    {
      this.dead = false;
    }

    if (this.frightTime > frameCount && !this.dead)
    {
      this.frightened = true;

      if ((this.frightTime - 60 * 2) < frameCount &&
          sin(this.frightTime - frameCount / 4) > 0)
      {
        fill(color(225, 221, 255));
      }
      else
      {
        fill(color(33, 33, 255));
      }

      if (triangles)
      {
        beginShape();
        vertex((this.pos.x - 0.25) * this.scale + this.xOff, (this.pos.y + 0.25) * this.scale + this.yOff);
        vertex(this.pos.x * this.scale + 1.25 * this.scale + this.xOff, (this.pos.y + 0.25) * this.scale + this.yOff);
        vertex(this.pos.x * this.scale + 1.25 * this.scale + this.xOff, this.pos.y * this.scale + this.scale * 7/8 + this.yOff);
        vertex(this.pos.x * this.scale + 1.25 * this.scale + this.xOff, this.pos.y * this.scale + this.scale * 1.25 + this.yOff);
        vertex(this.pos.x * this.scale + 1 * this.scale + this.xOff, this.pos.y * this.scale + this.scale * 7/8 + this.yOff);
        vertex(this.pos.x * this.scale + 0.75 * this.scale + this.xOff, this.pos.y * this.scale + this.scale * 1.25 + this.yOff);
        vertex(this.pos.x * this.scale + 0.5 * this.scale + this.xOff, this.pos.y * this.scale + this.scale * 7/8 + this.yOff);
        vertex(this.pos.x * this.scale + 0.25 * this.scale + this.xOff, this.pos.y * this.scale + this.scale * 1.25 + this.yOff);
        vertex(this.pos.x * this.scale + this.xOff, this.pos.y * this.scale + this.scale * 7/8 + this.yOff);
        vertex((this.pos.x - 0.25) * this.scale + this.xOff, this.pos.y * this.scale + this.scale * 1.25 + this.yOff);
        vertex((this.pos.x - 0.25) * this.scale + this.xOff, this.pos.y * this.scale + this.scale * 7/8 + this.yOff);
        endShape(CLOSE);
      }
      else
      {
        beginShape();
        vertex((this.pos.x - 0.25) * this.scale + this.xOff, (this.pos.y + 0.25) * this.scale + this.yOff);
        vertex(this.pos.x * this.scale + 1.25 * this.scale + this.xOff, (this.pos.y + 0.25) * this.scale + this.yOff);
        vertex(this.pos.x * this.scale + 1.25 * this.scale + this.xOff, this.pos.y * this.scale + this.scale * 7/8 + this.yOff);
        vertex(this.pos.x * this.scale + 1 * this.scale + this.xOff, this.pos.y * this.scale + this.scale * 1.25 + this.yOff);
        vertex(this.pos.x * this.scale + 0.75 * this.scale + this.xOff, this.pos.y * this.scale + this.scale * 7/8 + this.yOff);
        vertex(this.pos.x * this.scale + 0.5 * this.scale + this.xOff, this.pos.y * this.scale + this.scale * 1.25 + this.yOff);
        vertex(this.pos.x * this.scale + 0.25 * this.scale + this.xOff, this.pos.y * this.scale + this.scale * 7/8 + this.yOff);
        vertex(this.pos.x * this.scale + 0 * this.scale + this.xOff, this.pos.y * this.scale + this.scale * 1.25 + this.yOff);
        vertex((this.pos.x - 0.25) * this.scale + this.xOff, this.pos.y * this.scale + this.scale * 7/8 + this.yOff);
        endShape(CLOSE);
      }

      ellipse(
          (this.pos.x + 0.5) * this.scale + this.xOff,
          (this.pos.y + 0.25) * this.scale + this.yOff,
          this.scale * 1.5,
          this.scale * 1.2,
          PI,
          0);

      if ((this.frightTime - 60 * 2) < frameCount &&
          sin(this.frightTime - frameCount / 4) > 0)
      {
        stroke(color(255, 0, 0));
      }
      else
      {
        stroke(color(250, 185, 176));
      }

      strokeWeight(this.scale / 10);
      noFill();
      arc((this.pos.x + 0.04) * this.scale + this.xOff,
          (this.pos.y + 0.7) * this.scale + this.yOff,
          this.scale * 0.3,
          this.scale * 0.3,
          -PI + QUARTER_PI,
          -QUARTER_PI);
      arc((this.pos.x + 0.27) * this.scale + this.xOff,
          (this.pos.y + 0.5) * this.scale + this.yOff,
          this.scale * 0.3,
          this.scale * 0.3,
          +QUARTER_PI,
          +HALF_PI + QUARTER_PI);
      arc((this.pos.x + 0.5) * this.scale + this.xOff,
          (this.pos.y + 0.7) * this.scale + this.yOff,
          this.scale * 0.3,
          this.scale * 0.3,
          -PI + QUARTER_PI,
          -QUARTER_PI);
      arc((this.pos.x + 0.73) * this.scale + this.xOff,
          (this.pos.y + 0.5) * this.scale + this.yOff,
          this.scale * 0.3,
          this.scale * 0.3,
          +QUARTER_PI,
          +HALF_PI + QUARTER_PI);
      arc((this.pos.x + 0.96) * this.scale + this.xOff,
          (this.pos.y + 0.7) * this.scale + this.yOff,
          this.scale * 0.3,
          this.scale * 0.3,
          -PI + QUARTER_PI,
          -QUARTER_PI);

      fill(color(250, 185, 176));
      ellipse((this.pos.x + 0.28) * this.scale + this.xOff, 
          (this.pos.y + 0.15) * this.scale + this.yOff, 
          this.scale * 0.15,
          this.scale * 0.15);
      ellipse((this.pos.x + 0.73) * this.scale + this.xOff, 
          (this.pos.y + 0.15) * this.scale + this.yOff, 
          this.scale * 0.15,
          this.scale * 0.15);

    }
    else if (!this.dead)
    {
      this.frightened = false;
      this.dead = false;

      if (triangles)
      {
        beginShape();
        vertex((this.pos.x - 0.25) * this.scale + this.xOff, (this.pos.y + 0.25) * this.scale + this.yOff);
        vertex(this.pos.x * this.scale + 1.25 * this.scale + this.xOff, (this.pos.y + 0.25) * this.scale + this.yOff);
        vertex(this.pos.x * this.scale + 1.25 * this.scale + this.xOff, this.pos.y * this.scale + this.scale * 7/8 + this.yOff);
        vertex(this.pos.x * this.scale + 1.25 * this.scale + this.xOff, this.pos.y * this.scale + this.scale * 1.25 + this.yOff);
        vertex(this.pos.x * this.scale + 1 * this.scale + this.xOff, this.pos.y * this.scale + this.scale * 7/8 + this.yOff);
        vertex(this.pos.x * this.scale + 0.75 * this.scale + this.xOff, this.pos.y * this.scale + this.scale * 1.25 + this.yOff);
        vertex(this.pos.x * this.scale + 0.5 * this.scale + this.xOff, this.pos.y * this.scale + this.scale * 7/8 + this.yOff);
        vertex(this.pos.x * this.scale + 0.25 * this.scale + this.xOff, this.pos.y * this.scale + this.scale * 1.25 + this.yOff);
        vertex(this.pos.x * this.scale + this.xOff, this.pos.y * this.scale + this.scale * 7/8 + this.yOff);
        vertex((this.pos.x - 0.25) * this.scale + this.xOff, this.pos.y * this.scale + this.scale * 1.25 + this.yOff);
        vertex((this.pos.x - 0.25) * this.scale + this.xOff, this.pos.y * this.scale + this.scale * 7/8 + this.yOff);
        endShape(CLOSE);
      }
      else
      {
        beginShape();
        vertex((this.pos.x - 0.25) * this.scale + this.xOff, (this.pos.y + 0.25) * this.scale + this.yOff);
        vertex(this.pos.x * this.scale + 1.25 * this.scale + this.xOff, (this.pos.y + 0.25) * this.scale + this.yOff);
        vertex(this.pos.x * this.scale + 1.25 * this.scale + this.xOff, this.pos.y * this.scale + this.scale * 7/8 + this.yOff);
        vertex(this.pos.x * this.scale + 1 * this.scale + this.xOff, this.pos.y * this.scale + this.scale * 1.25 + this.yOff);
        vertex(this.pos.x * this.scale + 0.75 * this.scale + this.xOff, this.pos.y * this.scale + this.scale * 7/8 + this.yOff);
        vertex(this.pos.x * this.scale + 0.5 * this.scale + this.xOff, this.pos.y * this.scale + this.scale * 1.25 + this.yOff);
        vertex(this.pos.x * this.scale + 0.25 * this.scale + this.xOff, this.pos.y * this.scale + this.scale * 7/8 + this.yOff);
        vertex(this.pos.x * this.scale + 0 * this.scale + this.xOff, this.pos.y * this.scale + this.scale * 1.25 + this.yOff);
        vertex((this.pos.x - 0.25) * this.scale + this.xOff, this.pos.y * this.scale + this.scale * 7/8 + this.yOff);
        endShape(CLOSE);
      }

      ellipse(
          (this.pos.x + 0.5) * this.scale + this.xOff,
          (this.pos.y + 0.25) * this.scale + this.yOff,
          this.scale * 1.5,
          this.scale * 1.2,
          PI,
          0);
    }

    if (!this.frightened)
    {
      switch(this.dir.heading()/PI)
      {
        //UP
        case (-0.5):
          fill(255);
          ellipse((this.pos.x + 0.25) * this.scale + this.xOff, 
              (this.pos.y + 0.0) * this.scale + this.yOff, 
              this.scale * 0.4, 
              this.scale * 0.5);
          ellipse((this.pos.x + 0.75) * this.scale + this.xOff, 
              (this.pos.y + 0.0) * this.scale + this.yOff, 
              this.scale * 0.4, 
              this.scale * 0.5);
          fill(color(0, 0, 255));
          ellipse((this.pos.x + 0.25) * this.scale + this.xOff, 
              (this.pos.y - 0.12) * this.scale + this.yOff, 
              this.scale * 0.2, 
              this.scale * 0.25);
          ellipse((this.pos.x + 0.75) * this.scale + this.xOff, 
              (this.pos.y - 0.12) * this.scale + this.yOff, 
              this.scale * 0.2, 
              this.scale * 0.25);
          break;

        //DOWN
        case 0.5:
          fill(255);
          ellipse((this.pos.x + 0.25) * this.scale + this.xOff, 
              (this.pos.y + 0.25) * this.scale + this.yOff, 
              this.scale * 0.4, 
              this.scale * 0.5);
          ellipse((this.pos.x + 0.75) * this.scale + this.xOff, 
              (this.pos.y + 0.25) * this.scale + this.yOff, 
              this.scale * 0.4,
              this.scale * 0.5);
          fill(color(0, 0, 255));
          ellipse((this.pos.x + 0.25) * this.scale + this.xOff, 
              (this.pos.y + 0.39) * this.scale + this.yOff, 
              this.scale * 0.2,
              this.scale * 0.25);
          ellipse((this.pos.x + 0.75) * this.scale + this.xOff, 
              (this.pos.y + 0.39) * this.scale + this.yOff, 
              this.scale * 0.2,
              this.scale * 0.25);
          break;

        //LEFT
        case 1:
          fill(255);
          ellipse((this.pos.x + 0.0) * this.scale + this.xOff, 
              (this.pos.y + 0.25) * this.scale + this.yOff, 
              this.scale * 0.4,
              this.scale * 0.5);
          ellipse((this.pos.x + 0.5) * this.scale + this.xOff, 
              (this.pos.y + 0.25) * this.scale + this.yOff, 
              this.scale * 0.4,
              this.scale * 0.5);
          fill(color(0, 0, 255));
          ellipse((this.pos.x - 0.1) * this.scale + this.xOff, 
              (this.pos.y + 0.3) * this.scale + this.yOff, 
              this.scale * 0.2,
              this.scale * 0.25);
          ellipse((this.pos.x + 0.4) * this.scale + this.xOff, 
              (this.pos.y + 0.3) * this.scale + this.yOff, 
              this.scale * 0.2,
              this.scale * 0.25);
          break;

        //RIGHT
        case 0:
        default:
          fill(255);
          ellipse((this.pos.x + 0.50) * this.scale + this.xOff, 
              (this.pos.y + 0.25) * this.scale + this.yOff, 
              this.scale * 0.4,
              this.scale * 0.5);
          ellipse((this.pos.x + 1) * this.scale + this.xOff, 
              (this.pos.y + 0.25) * this.scale + this.yOff, 
              this.scale * 0.4,
              this.scale * 0.5);
          fill(color(0, 0, 255));
          ellipse((this.pos.x + 0.6) * this.scale + this.xOff, 
              (this.pos.y + 0.3) * this.scale + this.yOff, 
              this.scale * 0.2,
              this.scale * 0.25);
          ellipse((this.pos.x + 1.1) * this.scale + this.xOff, 
              (this.pos.y + 0.3) * this.scale + this.yOff, 
              this.scale * 0.2,
              this.scale * 0.25);
          break;
      }
    }


  }
}
