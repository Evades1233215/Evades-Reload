const Enemy = require('../classes/enemy');

class Shutter extends Enemy {
  constructor(props, area) {
    super(props, area);
    this.type = 'shutter';
    this.realVel = [this.vel[0] + 0, this.vel[1] + 0];
    this.timer = 0;
    this.friction = 0.03;
    this.dashed = false;
  }

  _behavior(delta) {
    this.timer += delta;
    if (this.timer > 4500) {
      this.vel = [this.realVel[0], this.realVel[1]];
      this.dashed = false;
      this.timer = this.timer % 4500;
    }
    if (this.timer > 3750 && !this.dashed) {
      this.vel = [this.realVel[0] / 5, this.realVel[1] / 5];
      this.dashed = true;
    }
  }

  _collide(area) {
    let w = area.defaults.width;
    let h = area.defaults.height;
    if (this.pos[0] - this.radius < 0) {
      this.pos[0] = this.radius;
      this.vel[0] = Math.abs(this.vel[0]);
      this.realVel[0] = Math.abs(this.realVel[0]);
    }
    if (this.pos[0] + this.radius > w) {
      this.pos[0] = w - this.radius;
      this.vel[0] = -Math.abs(this.vel[0]);
      this.realVel[0] = -Math.abs(this.realVel[0]);
    }
    if (this.pos[1] - this.radius < 0) {
      this.pos[1] = this.radius;
      this.vel[1] = Math.abs(this.vel[1]);
      this.realVel[1] = Math.abs(this.realVel[1]);
    }
    if (this.pos[1] + this.radius > h) {
      this.pos[1] = h - this.radius;
      this.vel[1] = -Math.abs(this.vel[1]);
      this.realVel[1] = -Math.abs(this.realVel[1]);
    }
  }
}

module.exports = Shutter;
