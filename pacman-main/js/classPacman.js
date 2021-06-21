class Pacman
{
  constructor (scale, xOff, yOff, pos, level, eatPowerPellet)
  {
    this.xOff = xOff;
    this.yOff = yOff;
    this.pos = pos;
    this.startingPos = pos;
    this.facing = createVector(1, 0);
    this.dir = createVector(0, 0);
    this.futureDir = createVector(0 ,0);
    this.scale = scale;
    this.animate = 0;
    this.speed = (1/6);
    this.notStarted = true;
    this.score = 0;
    this.lives = 3;
    this.dead = false;
    this.timeOfDeath = 0;
    this.deathAminateSpeed = 0.003;
    this.mouthSpeed = 0.5;
    this.pause = 0;
    this.level = level;
    this.eatPowerPellet = eatPowerPellet;
    this.pelletsEaten = 0;
    this.powerPelletsEaten = 0;

    if (1 == level)
    {
      this.speed *= 0.8;
    }
    else if (2 <= level && level <= 4)
    {
      this.speed *= 0.9;
    }
    else if (5 <= level && level <= 20)
    {
      this.speed *= 1;
    }
    else if (level >= 21)
    {
      this.speed *= 0.9;
    }
  }

  reset()
  {
    this.pos = this.startingPos.copy();
    this.facing = createVector(1, 0);
    this.dir = createVector(0, 0);
    this.futureDir = createVector(0 ,0);
    this.notStarted = true;
    this.timeOfDeath = 0;
  }

  changeDirection (dir)
  {
    if (!this.dead)
    {
      if (this.notStarted)
      {
        this.dir.x = dir.x;
        this.notStarted = (this.dir.mag() == 0);
      }
      else if (!this.dir.mag())
      {
        this.dir = dir;
      }
      else
      {
        this.futureDir = dir;
      }
    }
  }

  kill ()
  {
    this.dead = true;
    this.timeOfDeath = millis();
    this.dir = createVector(0, 0);
    this.futureDir = createVector(0 ,0);
    this.lives--;
  }

  move (map, debug = false)
  {
    // If we are going through the tunnel
    if (createVector(round(this.pos.x), round(this.pos.y)).equals(createVector(-1, 14)) &&
        this.dir.equals(createVector(-1, 0)))
    {
      this.pos = createVector(28, 14);
    }
    else if (createVector(round(this.pos.x), round(this.pos.y)).equals(createVector(28, 14)) &&
        this.dir.equals(createVector(1, 0)))
    {
      this.pos = createVector(-1, 14);
    }

    var x = round(this.pos.x);
    var y = round(this.pos.y);

    if (this.futureDir.mag() && map.getTileType(x + this.futureDir.x, y + this.futureDir.y) != 'W' &&
        map.getTileType(x + this.futureDir.x, y + this.futureDir.y) != 'D')
    {
      this.dir = this.futureDir;
      this.futureDir = createVector(0 ,0);
    }
    else if (map.getTileType(x + this.dir.x, y + this.dir.y) == 'W' ||
        map.getTileType(x + this.dir.x, y + this.dir.y) == 'D')
    {
      this.dir = createVector(0, 0);
    }

    var offCenter = createVector(x,y).sub(pacman.pos);

    if (!this.pause)
    {
      if (this.dir.mag())
      {
        if (this.dir.x == 0)
        {
          if (abs(Math.sign(offCenter.x) * this.speed) < abs(offCenter.x))
          {
            this.pos.x += Math.sign(offCenter.x) * this.speed;
          }
          else
          {
            this.pos.x += offCenter.x;
          }
        }

        if (this.dir.y == 0)
        {
          if (abs(Math.sign(offCenter.y) * this.speed) < abs(offCenter.y))
          {
            this.pos.y += Math.sign(offCenter.y) * this.speed;
          }
          else
          {
            this.pos.y += offCenter.y;
          }
        }

        this.facing = this.dir;
        this.animate += this.mouthSpeed;
      }
      else if (!this.notStarted)
      {
        if (abs(Math.sign(offCenter.x) * this.speed) < abs(offCenter.x))
        {
          this.pos.x += Math.sign(offCenter.x) * this.speed;
        }
        else
        {
          this.pos.x += offCenter.x;
        }

        if (abs(Math.sign(offCenter.y) * this.speed) < abs(offCenter.y))
        {
          this.pos.y += Math.sign(offCenter.y) * this.speed;
        }
        else
        {
          this.pos.y += offCenter.y;
        }
      }
    }

    if (map.getTileType(x, y) == '.')
    {
      map.setTileType(x, y, ' ');
      this.score += 10;
      this.pause = 1;
      this.pelletsEaten += 1;
      map.eatPellet(createVector(x, y));
    }

    if (map.getTileType(x, y) == '*')
    {
      map.setTileType(x, y, ' ');
      this.score += 50;
      this.pause = 3;
      this.eatPowerPellet();
      this.powerPelletsEaten += 1;
      map.eatPowerPellet(createVector(x, y));
    }

    if (!this.pause)
    {
      this.pos.add(this.dir.copy().mult(this.speed));
    }

    if (this.pause)
    {
      this.pause--;
    }
  }

  getPowerPelletsEaten()
  {
    return this.powerPelletsEaten;
  }

  getPelletsEaten()
  {
    return this.pelletsEaten;
  }

  show ()
  {
    noStroke();
    fill(color(255, 255, 0));

    if (this.dead)
    {
      var time = (millis() - this.timeOfDeath) * this.deathAminateSpeed;

      if (time < PI)
      {
        arc(this.pos.x * this.scale + this.scale / 2 + this.xOff,
            this.pos.y * this.scale + this.scale / 2 + this.yOff,
            this.scale * 1.5,
            this.scale * 1.5,
          -HALF_PI + time,
          -HALF_PI - time);
      }
      else if (PI <= time && time < 10)
      {
        stroke(color(255, 255, 0));
        strokeWeight(this.scale / 10);
        line(this.pos.x * this.scale + 0.569 * this.scale + this.xOff, this.pos.y * this.scale + 0.190 * this.scale + this.yOff, this.pos.x * this.scale + 0.655 * this.scale + this.xOff, this.pos.y * this.scale + 0.103 * this.scale + this.yOff);
        line(this.pos.x * this.scale + 0.741 * this.scale + this.xOff, this.pos.y * this.scale + 0.362 * this.scale + this.yOff, this.pos.x * this.scale + 0.828 * this.scale + this.xOff, this.pos.y * this.scale + 0.276 * this.scale + this.yOff);
        line(this.pos.x * this.scale + 0.828 * this.scale + this.xOff, this.pos.y * this.scale + 0.534 * this.scale + this.yOff, this.pos.x * this.scale + 0.931 * this.scale + this.xOff, this.pos.y * this.scale + 0.534 * this.scale + this.yOff);
        line(this.pos.x * this.scale + 0.741 * this.scale + this.xOff, this.pos.y * this.scale + 0.707 * this.scale + this.yOff, this.pos.x * this.scale + 0.828 * this.scale + this.xOff, this.pos.y * this.scale + 0.793 * this.scale + this.yOff);
        line(this.pos.x * this.scale + 0.569 * this.scale + this.xOff, this.pos.y * this.scale + 0.793 * this.scale + this.yOff, this.pos.x * this.scale + 0.655 * this.scale + this.xOff, this.pos.y * this.scale + 0.879 * this.scale + this.yOff);
        line(this.pos.x * this.scale + 0.397 * this.scale + this.xOff, this.pos.y * this.scale + 0.793 * this.scale + this.yOff, this.pos.x * this.scale + 0.310 * this.scale + this.xOff, this.pos.y * this.scale + 0.879 * this.scale + this.yOff);
        line(this.pos.x * this.scale + 0.224 * this.scale + this.xOff, this.pos.y * this.scale + 0.621 * this.scale + this.yOff, this.pos.x * this.scale + 0.138 * this.scale + this.xOff, this.pos.y * this.scale + 0.707 * this.scale + this.yOff);
        line(this.pos.x * this.scale + 0.138 * this.scale + this.xOff, this.pos.y * this.scale + 0.448 * this.scale + this.yOff, this.pos.x * this.scale + 0.052 * this.scale + this.xOff, this.pos.y * this.scale + 0.448 * this.scale + this.yOff);
        line(this.pos.x * this.scale + 0.224 * this.scale + this.xOff, this.pos.y * this.scale + 0.276 * this.scale + this.yOff, this.pos.x * this.scale + 0.138 * this.scale + this.xOff, this.pos.y * this.scale + 0.190 * this.scale + this.yOff);
        line(this.pos.x * this.scale + 0.397 * this.scale + this.xOff, this.pos.y * this.scale + 0.190 * this.scale + this.yOff, this.pos.x * this.scale + 0.310 * this.scale + this.xOff, this.pos.y * this.scale + 0.103 * this.scale + this.yOff);
      }
      else if (10 <= time && time <= 15)
      {
        //Render nothing
      }
      else if (time > 15)
      {
        //Reset the game with one less life
        this.dead = false;
      }
    }
    else
    {
      //UP
      if (this.facing.y == -1)
      {
        arc(this.pos.x * this.scale + this.scale / 2 + this.xOff,
            this.pos.y * this.scale + this.scale / 2 + this.yOff,
            this.scale * 1.5,
            this.scale * 1.5,
            -QUARTER_PI - QUARTER_PI/2 - (sin(this.animate) * QUARTER_PI/2),
            -HALF_PI - QUARTER_PI/2 + (sin(this.animate) * QUARTER_PI/2));
      }

      //DOWN
      else if (this.facing.y == 1)
      {
        arc(this.pos.x * this.scale + this.scale / 2 + this.xOff,
            this.pos.y * this.scale + this.scale / 2 + this.yOff,
            this.scale * 1.5,
            this.scale * 1.5,
            HALF_PI + QUARTER_PI/2 - (sin(this.animate) * QUARTER_PI/2),
            HALF_PI - QUARTER_PI/2 + (sin(this.animate) * QUARTER_PI/2));
      }

      // LEFT
      else if (this.facing.x == -1)
      {
        arc(this.pos.x * this.scale + this.scale / 2 + this.xOff,
            this.pos.y * this.scale + this.scale / 2 + this.yOff,
            this.scale * 1.5,
            this.scale * 1.5,
            -PI + QUARTER_PI/2 - (sin(this.animate) * QUARTER_PI/2),
            -PI - QUARTER_PI/2 + (sin(this.animate) * QUARTER_PI/2));
      }

      // RIGHT
      else if (this.facing.x == 1)
      {
        arc(this.pos.x * this.scale + this.scale / 2 + this.xOff,
            this.pos.y * this.scale + this.scale / 2 + this.yOff,
            this.scale * 1.5,
            this.scale * 1.5,
            QUARTER_PI - QUARTER_PI/2 - (sin(this.animate) * QUARTER_PI/2),
            -QUARTER_PI + QUARTER_PI/2 + (sin(this.animate) * QUARTER_PI/2));
      }
    }
  }
}
