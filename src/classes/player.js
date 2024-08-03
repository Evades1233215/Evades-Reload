const config = require('../config');
const dist = require('../lib/distance');
const randomBetween = require('../lib/random');

class Player {
  constructor(props) {
    this.name = props.name;
    this.id = props.id;
    this.pos = [
      randomBetween(config.player.spawn.sx, config.player.spawn.ex),
      randomBetween(config.player.spawn.sy, config.player.spawn.ey),
    ];
    this.radius = config.player.radius;
    this.vel = [0, 0];
    this.acc = [0, 0];
    this.slide = [0, 0];
    this.speed = config.player.speed;
    this.energy = config.player.energy;
    this.maxEnergy = config.player.spawnMaxEnergy;
    this.regen = config.player.regen;
    this.downed = false;
    this.area = config.player.spawn.area;
    this.world = config.player.spawn.world;
  }

  update(delta) {
    const timeFix = delta / (1000 / 30);

    let slide = [this.slide[0], this.slide[1]];

    let dim = 1 - 0.75;

    slide[0] *= 1 - (1 - dim) * timeFix;
    slide[1] *= 1 - (1 - dim) * timeFix;

    this.acc[0] *= timeFix;
    this.acc[1] *= timeFix;

    this.acc[0] += slide[0];
    this.acc[1] += slide[1];

    if (Math.abs(this.acc[0]) < 0.1) this.acc[0] = 0;
    if (Math.abs(this.acc[1]) < 0.1) this.acc[1] = 0;

    this.vel = [this.acc[0], this.acc[1]];

    this.vel[0] > this.speed ? (this.vel[0] = this.speed) : 'none';
    this.vel[0] < -this.speed ? (this.vel[0] = -this.speed) : 'none';
    this.vel[1] > this.speed ? (this.vel[1] = this.speed) : 'none';
    this.vel[1] < -this.speed ? (this.vel[1] = -this.speed) : 'none';

    if (this.downed) {
      this.vel[0] = 0;
      this.vel[1] = 0;
    }

    this.pos[0] += this.vel[0] * timeFix;
    this.pos[1] += this.vel[1] * timeFix;

    this.pos[0] = Math.round(this.pos[0] * 10) / 10;
    this.pos[1] = Math.round(this.pos[1] * 10) / 10;

    this.slide = [this.acc[0] + 0, this.acc[1] + 0];
    this.acc = [0, 0];
  }

  move(movement) {
    let shift = movement.isShift ? 0.5 : 1;
    if (movement.KeyA) {
      this.acc[0] = -this.speed * shift;
    }
    if (movement.KeyD) {
      this.acc[0] = this.speed * shift;
    }
    if (movement.KeyW) {
      this.acc[1] = -this.speed * shift;
    }
    if (movement.KeyS) {
      this.acc[1] = this.speed * shift;
    }

    if (movement.mouseEnable) {
      let distance = dist(0, 0, movement.mousePos[0], movement.mousePos[1]);

      let speedX = movement.mousePos[0];
      let speedY = movement.mousePos[1];

      if (distance > 150) {
        speedX = movement.mousePos[0] * (150 / distance);
        speedY = movement.mousePos[1] * (150 / distance);
      }

      let angle = Math.atan2(speedY, speedX);

      let mouseDist = Math.min(
        150,
        Math.sqrt(movement.mousePos[0] ** 2 + movement.mousePos[1] ** 2)
      );
      let distMovement = this.speed * shift;
      distMovement *= mouseDist / 150;

      this.acc[0] = distMovement * Math.cos(angle);
      this.acc[1] = distMovement * Math.sin(angle);
    }
  }
}

module.exports = Player;
