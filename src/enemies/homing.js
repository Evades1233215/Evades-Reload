const Enemy = require('../classes/enemy');
const distance = require('../lib/distance');

class Homing extends Enemy {
  constructor(props, area) {
    super(props, area);
    this.type = 'homing';
    this.targetAngle = this.angle;
    this.area = area;
  }

  _behavior(delta, players) {
    let min = 5.625 * 32;
    let index;
    for (let i in players) {
      let player = players[i];
      if (
        !player.downed &&
        player.pos[0] + player.radius > 0 &&
        player.pos[0] - player.radius < this.area.defaults.width
      )
        if (distance(player.pos[0], player.pos[1], this.pos[0], this.pos[1]) <= min) {
          min = distance(player.pos[0], player.pos[1], this.pos[0], this.pos[1]);
          index = player;
        }
    }
    if (index != undefined) {
      let dX = index.pos[0] - this.pos[0];
      let dY = index.pos[1] - this.pos[1];
      this.targetAngle = Math.atan2(dY, dX);
    }
    this._velToAngle();
    let dif = this.targetAngle - this.angle;
    let angleDif = Math.atan2(Math.sin(dif), Math.cos(dif));
    let angleIncrement = 0.04;
    if (Math.abs(angleDif) >= angleIncrement) {
      if (angleDif < 0) this.angle -= angleIncrement * (delta / 30);
      else this.angle += angleIncrement * (delta / 30);
    }
    this._angleToVel();
  }

  _angleToVel(ang = this.angle) {
    this.vel[0] = Math.cos(ang) * this.speed;
    this.vel[1] = Math.sin(ang) * this.speed;
  }

  _velToAngle() {
    this.angle = Math.atan2(this.vel[1], this.vel[0]);
    var dist = distance(0, 0, this.vel[0], this.vel[1]);
    this.speed = dist;
  }

  _collide(area) {
    let w = area.defaults.width;
    let h = area.defaults.height;
    if (this.pos[0] - this.radius < 0) {
      this.pos[0] = this.radius;
      this.vel[0] = Math.abs(this.vel[0]);
      this._velToAngle();
      this.targetAngle = this.angle;
    }
    if (this.pos[0] + this.radius > w) {
      this.pos[0] = w - this.radius;
      this.vel[0] = -Math.abs(this.vel[0]);
      this._velToAngle();
      this.targetAngle = this.angle;
    }
    if (this.pos[1] - this.radius < 0) {
      this.pos[1] = this.radius;
      this.vel[1] = Math.abs(this.vel[1]);
      this._velToAngle();
      this.targetAngle = this.angle;
    }
    if (this.pos[1] + this.radius > h) {
      this.pos[1] = h - this.radius;
      this.vel[1] = -Math.abs(this.vel[1]);
      this._velToAngle();
      this.targetAngle = this.angle;
    }
  }
}

module.exports = Homing;
