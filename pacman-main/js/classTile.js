class Tile
{
  constructor (pos, type)
  {
    this.pos = pos;
    this.center = this.pos.copy().add(createVector(0.5, 0.5));
    this.type = type;
    this.intersection = false;
    this.targetDistace = 0;
  }
}
