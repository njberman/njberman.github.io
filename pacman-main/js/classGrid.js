const INVALID = -1;
const S = 0; //SPACE
const W = 1; //WALL
const F = 2; //FOOD
const P = 3; //POWERFOOD
const T = 4; //Teleport

class MapOld
{
  constructor (scale)
  {
    this.scale = scale;
    this.playfield =
      [
        [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W],
        [W,F,F,F,F,F,F,F,F,F,F,F,F,W,W,F,F,F,F,F,F,F,F,F,F,F,F,W],
        [W,F,W,W,W,W,F,W,W,W,W,W,F,W,W,F,W,W,W,W,W,F,W,W,W,W,F,W],
        [W,P,W,S,S,W,F,W,S,S,S,W,F,W,W,F,W,S,S,S,W,F,W,S,S,W,P,W],
        [W,F,W,W,W,W,F,W,W,W,W,W,F,W,W,F,W,W,W,W,W,F,W,W,W,W,F,W],
        [W,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,W],
        [W,F,W,W,W,W,F,W,W,F,W,W,W,W,W,W,W,W,F,W,W,F,W,W,W,W,F,W],
        [W,F,W,W,W,W,F,W,W,F,W,W,W,W,W,W,W,W,F,W,W,F,W,W,W,W,F,W],
        [W,F,F,F,F,F,F,W,W,F,F,F,F,W,W,F,F,F,F,W,W,F,F,F,F,F,F,W],
        [W,W,W,W,W,W,F,W,W,W,W,W,F,W,W,F,W,W,W,W,W,F,W,W,W,W,W,W],
        [S,S,S,S,S,W,F,W,W,W,W,W,S,W,W,S,W,W,W,W,W,F,W,S,S,S,S,S],
        [S,S,S,S,S,W,F,W,W,S,S,S,S,S,S,S,S,S,S,W,W,F,W,S,S,S,S,S],
        [S,S,S,S,S,W,F,W,W,S,W,W,W,W,W,W,W,W,S,W,W,F,W,S,S,S,S,S],
        [W,W,W,W,W,W,F,W,W,S,W,S,S,S,S,S,S,W,S,W,W,F,W,W,W,W,W,W],
        [T,S,S,S,S,S,F,S,S,S,W,S,S,S,S,S,S,W,S,S,S,F,S,S,S,S,S,T],
        [W,W,W,W,W,W,F,W,W,S,W,S,S,S,S,S,S,W,S,W,W,F,W,W,W,W,W,W],
        [S,S,S,S,S,W,F,W,W,S,W,W,W,W,W,W,W,W,S,W,W,F,W,S,S,S,S,S],
        [S,S,S,S,S,W,F,W,W,S,S,S,S,S,S,S,S,S,S,W,W,F,W,S,S,S,S,S],
        [S,S,S,S,S,W,F,W,W,S,W,W,W,W,W,W,W,W,S,W,W,F,W,S,S,S,S,S],
        [W,W,W,W,W,W,F,W,W,S,W,W,W,W,W,W,W,W,S,W,W,F,W,W,W,W,W,W],
        [W,F,F,F,F,F,F,F,F,F,F,F,F,W,W,F,F,F,F,F,F,F,F,F,F,F,F,W],
        [W,F,W,W,W,W,F,W,W,W,W,W,F,W,W,F,W,W,W,W,W,F,W,W,W,W,F,W],
        [W,F,W,W,W,W,F,W,W,W,W,W,F,W,W,F,W,W,W,W,W,F,W,W,W,W,F,W],
        [W,P,F,F,W,W,F,F,F,F,F,F,F,S,S,F,F,F,F,F,F,F,W,W,F,F,P,W],
        [W,W,W,F,W,W,F,W,W,F,W,W,W,W,W,W,W,W,F,W,W,F,W,W,F,W,W,W],
        [W,W,W,F,W,W,F,W,W,F,W,W,W,W,W,W,W,W,F,W,W,F,W,W,F,W,W,W],
        [W,F,F,F,F,F,F,W,W,F,F,F,F,W,W,F,F,F,F,W,W,F,F,F,F,F,F,W],
        [W,F,W,W,W,W,W,W,W,W,W,W,F,W,W,F,W,W,W,W,W,W,W,W,W,W,F,W],
        [W,F,W,W,W,W,W,W,W,W,W,W,F,W,W,F,W,W,W,W,W,W,W,W,W,W,F,W],
        [W,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,W],
        [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W],
        [S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S]
      ];

    this.mapWidth = this.playfield[0].length;
    this.mapHeight = this.playfield.length;

  }

  getPlayfield()
  {
    return this.playfield;
  }

  getCellType(x, y)
  {
    if (x < 0 || x > this.mapWidth || y < 0 || y > this.mapHeight)
    {
      return INVALID;
    }
    else
    {
      // console.log(x, y);
      return this.playfield[y][x];
    }
  }

  static setCellType(x, y, type)
  {
    this.playfield[y][x] = type;
  }


  draw(debug = false)
  {
    let x = 0;
    let y = 0;

    noStroke();

    for (x = 0; x < this.mapWidth; x++)
    {
      for (y = 0; y < this.mapHeight; y++)
      {
        switch (this.getCellType(x, y))
        {
          case S:
            fill(color(0, 0, 0));
            break;

          case W:
            //Check for walls across from each other
            strokeWeight(this.scale / 10);
            noFill();
            stroke(0, 0, 255);

            if (
                this.getCellType(x - 1, y) == W &&
                this.getCellType(x, y - 1) == W &&
                this.getCellType(x - 1, y - 1) != W)
            {
              arc(x * this.scale, y * this.scale, this.scale, this.scale, 0, HALF_PI);
            }
            else if (
                this.getCellType(x + 1, y) == W &&
                this.getCellType(x, y - 1) == W &&
                this.getCellType(x + 1, y - 1) != W)
            {
              arc(x * this.scale + this.scale, y * this.scale, this.scale, this.scale, HALF_PI, PI);
            }
            else if (
                this.getCellType(x - 1, y) == W &&
                this.getCellType(x, y + 1) == W &&
                this.getCellType(x - 1, y + 1) != W)
            {
              arc(x * this.scale, y * this.scale + this.scale, this.scale, this.scale, HALF_PI + PI, 0);
            }
            else if (
                this.getCellType(x + 1, y) == W &&
                this.getCellType(x, y + 1) == W &&
                this.getCellType(x + 1, y + 1) != W)
            {
              arc(x * this.scale + this.scale, y * this.scale + this.scale, this.scale, this.scale, PI, HALF_PI + PI);
            }
            else if (
                (this.getCellType(x - 1, y) == W &&
                this.getCellType(x + 1, y) == W) ||
                this.getCellType(x, y - 1) == T || this.getCellType(x, y + 1) == T)
            {
              line(x * this.scale, y * this.scale + (this.scale / 2), x * this.scale + this.scale, y * this.scale + (this.scale / 2));
            }
            else if (this.getCellType(x, y - 1) == W &&
                this.getCellType(x, y + 1) == W)
            {
              line(x * this.scale + (this.scale / 2), y * this.scale, x * this.scale + (this.scale / 2), y * this.scale + this.scale);
            }
            else if (
                this.getCellType(x - 1, y) == W &&
                this.getCellType(x, y - 1) == W)
            {
              arc(x * this.scale, y * this.scale, this.scale, this.scale, 0, HALF_PI);
            }
            else if (
                this.getCellType(x + 1, y) == W &&
                this.getCellType(x, y - 1) == W)
            {
              arc(x * this.scale + this.scale, y * this.scale, this.scale, this.scale, HALF_PI, PI);
            }
            else if (
                this.getCellType(x - 1, y) == W &&
                this.getCellType(x, y + 1) == W)
            {
              arc(x * this.scale, y * this.scale + this.scale, this.scale, this.scale, HALF_PI + PI, 0);
            }
            else if (
                this.getCellType(x + 1, y) == W &&
                this.getCellType(x, y + 1) == W)
            {
              arc(x * this.scale + this.scale, y * this.scale + this.scale, this.scale, this.scale, PI, HALF_PI + PI);
            }
            else
            {
              fill(color(255, 0, 0));
              rect(x * this.scale, y * this.scale, this.scale, this.scale);
            }
            break;

          case F:
            noStroke();
            fill(color(255, 200, 100));
            rect((x * this.scale) - foodSize / 2 + this.scale / 2, (y * this.scale) - foodSize / 2 + this.scale / 2, foodSize, foodSize);
            break;

          case P:
            noStroke();
            fill(color(255, 200, 100));
            ellipse((x * this.scale) + this.scale / 2, (y * this.scale) + this.scale / 2, pelletSize, pelletSize);
            break;

          case T:
            fill(color(255, 0, 0));
            break;
        }

        if (debug)
        {
          strokeWeight(2);
          stroke(100, 100, 100);
          noFill();
          rect(x * this.scale, y * this.scale, this.scale, this.scale);
        }
      }
    }
  }
}
