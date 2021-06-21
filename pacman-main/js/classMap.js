class Map
{
  constructor (scale, xOff, yOff)
  {
    this.scale = scale;
    this.xOff = xOff;
    this.yOff = yOff;
    this.tiles = [];
    this.mapFile =
      [
        ['W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W'],
        ['W','.','.','.','.','.','.','.','.','.','.','.','.','W','W','.','.','.','.','.','.','.','.','.','.','.','.','W'],
        ['W','.','W','W','W','W','.','W','W','W','W','W','.','W','W','.','W','W','W','W','W','.','W','W','W','W','.','W'],
        ['W','*','W',' ',' ','W','.','W',' ',' ',' ','W','.','W','W','.','W',' ',' ',' ','W','.','W',' ',' ','W','*','W'],
        ['W','.','W','W','W','W','.','W','W','W','W','W','.','W','W','.','W','W','W','W','W','.','W','W','W','W','.','W'],
        ['W','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','W'],
        ['W','.','W','W','W','W','.','W','W','.','W','W','W','W','W','W','W','W','.','W','W','.','W','W','W','W','.','W'],
        ['W','.','W','W','W','W','.','W','W','.','W','W','W','W','W','W','W','W','.','W','W','.','W','W','W','W','.','W'],
        ['W','.','.','.','.','.','.','W','W','.','.','.','.','W','W','.','.','.','.','W','W','.','.','.','.','.','.','W'],
        ['W','W','W','W','W','W','.','W','W','W','W','W','.','W','W','.','W','W','W','W','W','.','W','W','W','W','W','W'],
        [' ',' ',' ',' ',' ','W','.','W','W','W','W','W',' ','W','W',' ','W','W','W','W','W','.','W',' ',' ',' ',' ',' '],
        [' ',' ',' ',' ',' ','W','.','W','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W','W','.','W',' ',' ',' ',' ',' '],
        [' ',' ',' ',' ',' ','W','.','W','W',' ','W','W','W','W','W','W','W','W',' ','W','W','.','W',' ',' ',' ',' ',' '],
        ['W','W','W','W','W','W','.','W','W',' ','W','H','H','H','H','H','H','W',' ','W','W','.','W','W','W','W','W','W'],
        ['T','T','T','T','T',' ','.',' ',' ',' ','W','H','H','H','H','H','H','W',' ',' ',' ','.',' ','T','T','T','T','T'],
        ['W','W','W','W','W','W','.','W','W',' ','W','H','H','H','H','H','H','W',' ','W','W','.','W','W','W','W','W','W'],
        [' ',' ',' ',' ',' ','W','.','W','W',' ','W','W','W','W','W','W','W','W',' ','W','W','.','W',' ',' ',' ',' ',' '],
        [' ',' ',' ',' ',' ','W','.','W','W',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','W','W','.','W',' ',' ',' ',' ',' '],
        [' ',' ',' ',' ',' ','W','.','W','W',' ','W','W','W','W','W','W','W','W',' ','W','W','.','W',' ',' ',' ',' ',' '],
        ['W','W','W','W','W','W','.','W','W',' ','W','W','W','W','W','W','W','W',' ','W','W','.','W','W','W','W','W','W'],
        ['W','.','.','.','.','.','.','.','.','.','.','.','.','W','W','.','.','.','.','.','.','.','.','.','.','.','.','W'],
        ['W','.','W','W','W','W','.','W','W','W','W','W','.','W','W','.','W','W','W','W','W','.','W','W','W','W','.','W'],
        ['W','.','W','W','W','W','.','W','W','W','W','W','.','W','W','.','W','W','W','W','W','.','W','W','W','W','.','W'],
        ['W','*','.','.','W','W','.','.','.','.','.','.','.',' ',' ','.','.','.','.','.','.','.','W','W','.','.','*','W'],
        ['W','W','W','.','W','W','.','W','W','.','W','W','W','W','W','W','W','W','.','W','W','.','W','W','.','W','W','W'],
        ['W','W','W','.','W','W','.','W','W','.','W','W','W','W','W','W','W','W','.','W','W','.','W','W','.','W','W','W'],
        ['W','.','.','.','.','.','.','W','W','.','.','.','.','W','W','.','.','.','.','W','W','.','.','.','.','.','.','W'],
        ['W','.','W','W','W','W','W','W','W','W','W','W','.','W','W','.','W','W','W','W','W','W','W','W','W','W','.','W'],
        ['W','.','W','W','W','W','W','W','W','W','W','W','.','W','W','.','W','W','W','W','W','W','W','W','W','W','.','W'],
        ['W','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','W'],
        ['W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W']
      ];

    this.ghostWalls = ["12,10", "15,10", "12,22", "15,22"];
    this.teleport = [["0,14"], ["27,14"]];
    this.houseCenter = createVector(13.5, 14);

    this.rows = this.mapFile.length;
    this.cols = this.mapFile[0].length;
    this.foodSize = this.scale / 6;
    this.pelletSize = this.scale / 1.75;
    this.startingPowerPelletCount = 0;
    this.startingPelletCount = 0;

    this.pelletArray = [];
    this.powerPelletArray = [];
    this.mapImage;

    this.animateSpeed = 0.02;

    for (var i = 0; i < this.cols; i++)
    {
      this.tiles[i] = new Array(this.rows);
    }

    for (var j = 0; j < this.rows; j++)
    {
      for (var i = 0; i < this.cols; i++)
      {
        this.tiles[i][j] = new Tile(createVector(i, j), this.mapFile[j][i]);
        if (this.mapFile[j][i] == '.')
        {
          this.startingPelletCount++;
          this.pelletArray.push(createVector(i, j));
        }
        else if (this.mapFile[j][i] == '*')
        {
          this.startingPowerPelletCount++;
          this.powerPelletArray.push(createVector(i, j));
        }
      }
    }

    //Identify intersections
    for (var j = 1; j < this.rows - 1; j++)
    {
      for (var i = 1; i < this.cols - 1; i++)
      {
        if (this.tiles[i][j].type == '.' || this.tiles[i][j].type == ' ')
        {
          var totalPaths = 0;
          (this.tiles[i + 1][j + 0].type != 'W')? totalPaths++ : false;
          (this.tiles[i - 1][j + 0].type != 'W')? totalPaths++ : false;
          (this.tiles[i + 0][j + 1].type != 'W')? totalPaths++ : false;
          (this.tiles[i + 0][j - 1].type != 'W')? totalPaths++ : false;
          (totalPaths > 2)? this.tiles[i][j].intersection = true : this.tiles[i][j].intersection = false;
        }
      }
    }

    this.createMapImage();
    this.mapImage = get();
    this.mapImage.loadPixels();
  }

  getstartingPelletCount()
  {
    return this.startingPelletCount;
  }

  getstartingPowerPelletCount()
  {
    return this.startingPowerPelletCount;
  }

  getHouseCenter()
  {
    return this.houseCenter;
  }

  getTileType(x, y)
  {
    if (x < 0 || x >= this.cols || y < 0 || y >= this.rows)
    {
      return INVALID;
    }
    else
    {
      return this.tiles[x][y].type;
    }
  }

  setTileType(x, y, type)
  {
    if (x < 0 || x >= this.cols || y < 0 || y >= this.rows)
    {
      return INVALID;
    }
    else
    {
      this.tiles[x][y].type = type;
    }
  }

  isIntersection(x, y)
  {
    if (x < 0 || x >= this.cols || y < 0 || y >= this.rows)
    {
      return false;
    }
    else
    {
      return this.tiles[x][y].intersection;
    }
  }

  getTileTypeVector(pos)
  {
    var x = round(pos.x);
    var y = round(pos.y);

    if (x < 0 || x >= this.cols || y < 0 || y >= this.rows)
    {
      return INVALID;
    }
    else
    {
      return this.tiles[x][y].type;
    }
  }

  createMapImage(debug = false)
  {
    noStroke();

    for (var y = 0; y < this.rows; y++)
    {
      for (var x = 0; x < this.cols; x++)
      {
        if (debug)
        {
          textSize(this.scale / 3);
          fill(255);
          // text(x + ", " + y, x * this.scale, y * this.scale + this.scale / 2);
          strokeWeight(2);
          stroke(100, 100, 100);
          noFill();
          rect(x * this.scale, y * this.scale, this.scale, this.scale);
        }

        switch (this.getTileType(x, y))
        {
          case 'W':
            //Check for walls across from each other
            strokeWeight(this.scale / 10);
            noFill();
            stroke(0, 0, 255);

            if (
                this.getTileType(x - 1, y) == 'W' &&
                this.getTileType(x, y - 1) == 'W' &&
                this.getTileType(x - 1, y - 1) != 'W')
            {
              arc(x * this.scale + this.xOff, y * this.scale + this.yOff, this.scale, this.scale, 0, HALF_PI);
            }
            else if (
                this.getTileType(x + 1, y) == 'W' &&
                this.getTileType(x, y - 1) == 'W' &&
                this.getTileType(x + 1, y - 1) != 'W')
            {
              arc(x * this.scale + this.scale + this.xOff, y * this.scale + this.yOff, this.scale, this.scale, HALF_PI, PI);
            }
            else if (
                this.getTileType(x - 1, y) == 'W' &&
                this.getTileType(x, y + 1) == 'W' &&
                this.getTileType(x - 1, y + 1) != 'W')
            {
              arc(x * this.scale + this.xOff, y * this.scale + this.scale + this.yOff, this.scale, this.scale, HALF_PI + PI, 0);
            }
            else if (
                this.getTileType(x + 1, y) == 'W' &&
                this.getTileType(x, y + 1) == 'W' &&
                this.getTileType(x + 1, y + 1) != 'W')
            {
              arc(x * this.scale + this.scale + this.xOff, y * this.scale + this.scale + this.yOff, this.scale, this.scale, PI, HALF_PI + PI);
            }
            else if (
                ((this.getTileType(x - 1, y) == 'W' || this.getTileType(x - 1, y) == 'D') &&
                (this.getTileType(x + 1, y) == 'W' || this.getTileType(x + 1, y) == 'D')) ||
                this.getTileType(x, y - 1) == 'T' || this.getTileType(x, y + 1) == 'T')
            {
              line(x * this.scale + this.xOff, y * this.scale + (this.scale / 2) + this.yOff, x * this.scale + this.scale + this.xOff, y * this.scale + (this.scale / 2) + this.yOff);
            }
            else if (this.getTileType(x, y - 1) == 'W' &&
                this.getTileType(x, y + 1) == 'W')
            {
              line(x * this.scale + (this.scale / 2) + this.xOff, y * this.scale + this.yOff, x * this.scale + (this.scale / 2) + this.xOff, y * this.scale + this.scale + this.yOff);
            }
            else if (
                this.getTileType(x - 1, y) == 'W' &&
                this.getTileType(x, y - 1) == 'W')
            {
              arc(x * this.scale + this.xOff, y * this.scale + this.yOff, this.scale, this.scale, 0, HALF_PI);
            }
            else if (
                this.getTileType(x + 1, y) == 'W' &&
                this.getTileType(x, y - 1) == 'W')
            {
              arc(x * this.scale + this.scale + this.xOff, y * this.scale + this.yOff, this.scale, this.scale, HALF_PI, PI);
            }
            else if (
                this.getTileType(x - 1, y) == 'W' &&
                this.getTileType(x, y + 1) == 'W')
            {
              arc(x * this.scale + this.xOff, y * this.scale + this.scale + this.yOff, this.scale, this.scale, HALF_PI + PI, 0);
            }
            else if (
                this.getTileType(x + 1, y) == 'W' &&
                this.getTileType(x, y + 1) == 'W')
            {
              arc(x * this.scale + this.scale + this.xOff, y * this.scale + this.scale + this.yOff, this.scale, this.scale, PI, HALF_PI + PI);
            }
            else
            {
              fill(color(255, 0, 0));
              rect(x * this.scale + this.xOff, y * this.scale + this.yOff, this.scale, this.scale);
            }
            break;
        }
      }
    }
  }

  eatPellet(pos)
  {
    for (var i = this.pelletArray.length - 1; i >=0; i--)
    {
      if (this.pelletArray[i].equals(pos))
      {
        this.pelletArray.splice(i, 1);
      }
    }
  }

  eatPowerPellet(pos)
  {
    for (var i = this.powerPelletArray.length - 1; i >=0; i--)
    {
      if (this.powerPelletArray[i].equals(pos))
      {
        this.powerPelletArray.splice(i, 1);
      }
    }
  }

  show (debug = false)
  {
    noStroke();
    image(this.mapImage, 0, 0);

    noStroke();
    fill(color(255, 184, 151));
    var i = 0;

    for (i = 0; i < this.pelletArray.length; i++)
    {
      rect((this.pelletArray[i].x * this.scale) - this.foodSize / 2 + this.scale / 2 + this.xOff,
          (this.pelletArray[i].y * this.scale) - this.foodSize / 2 + this.scale / 2 + this.yOff,
          this.foodSize,
          this.foodSize);
    }

    for (i = 0; i < this.powerPelletArray.length; i++)
    {
      if (sin(millis() * this.animateSpeed) > 0)
      {
        ellipse((this.powerPelletArray[i].x * this.scale) + this.scale / 2 + this.xOff,
            (this.powerPelletArray[i].y * this.scale) + this.scale / 2 + this.yOff,
            this.pelletSize);
      }
    }
  }
}
