class Bonus
{
  constructor (pos, scale, xOff, yOff, value)
  {
    this.pos = pos;
    this.value = value;
    this.scale = scale;
    this.xOff = xOff;
    this.yOff = yOff;
    this.active = false;
    this.bonusTime = 0;
  }

  setBonusTime (time)
  {
    if (!this.bonusTime)
    {
      this.bonusTime = millis() + time * 1000;
    }
  }

  bonusEaten ()
  {
    this.bonusTime = 0;
  }

  show()
  {
    if (this.bonusTime > millis())
    {
      var x = this.pos.x;
      var y = this.pos.y;
      var scale = this.scale;

      noStroke();
      fill(255, 0, 0);
      ellipse((x + 0.25) * scale + this.xOff, (y + 0.589) * scale + this.yOff, scale * 0.5);
      fill(0, 0, 0);
      ellipse((x + 0.621) * scale + this.xOff, (y + 0.750) * scale + this.yOff, scale * 0.5);
      fill(255, 0, 0);
      ellipse((x + 0.653) * scale + this.xOff, (y + 0.766) * scale + this.yOff, scale * 0.5);
      noFill();
      stroke(222, 151, 81);
      strokeWeight(scale /10);
      arc((x + 1.3) * scale + this.xOff, (y + 0.774) * scale + this.yOff, scale * 1.452, scale * 1.565, 9.598, 10.619);
      arc((x + 1) * scale + this.xOff, (y + 0.919) * scale + this.yOff, scale * 1.758, scale * 1.774, 9.990, 10.996);
      stroke(255,155);
      strokeWeight(scale / 10);
      line((x + 0.194) * scale + this.xOff, (y + 0.694) * scale + this.yOff, (x + 0.113) * scale + this.xOff, (y + 0.613) * scale + this.yOff);
      line((x + 0.597) * scale + this.xOff, (y + 0.855) * scale + this.yOff, (x + 0.532) * scale + this.xOff, (y + 0.774) * scale + this.yOff);
      stroke(255, 155);
      strokeWeight(scale / 24);
      line((x + 0.194) * scale + this.xOff, (y + 0.694) * scale + this.yOff, (x + 0.113) * scale + this.xOff, (y + 0.613) * scale + this.yOff);
      line((x + 0.597) * scale + this.xOff, (y + 0.855) * scale + this.yOff, (x + 0.532) * scale + this.xOff, (y + 0.774) * scale + this.yOff);
    }
    else if(this.bonusTime)
    {
      this.bonusTime = 0;
    }
  }
}
