class Spot
{
  constructor(x, y, scale, wall)
  {
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.x = x;
    this.y = y;
    this.scale = scale;
    this.neighbors = [];
    this.previous = undefined;
    this.wall = wall;
  }

  addNeighbors (grid, rows, cols)
  {
    var x = this.x;
    var y = this.y;

    if (x < cols - 1)
    {
        this.neighbors.push(grid[x + 1][y]);
    }

    if (x > 0)
    {
        this.neighbors.push(grid[x - 1][y]);
    }

    if (y < rows - 1)
    {
        this.neighbors.push(grid[x][y + 1]);
    }

    if (y > 0)
    {
        this.neighbors.push(grid[x][y - 1]);
    }
  }

  show(color)
  {
    fill(color);
    noStroke();
    ellipse((this.x + 0.5) * this.scale, (this.y + 0.5) * this.scale, this.scale / 2, this.scale / 2);
  }
}
