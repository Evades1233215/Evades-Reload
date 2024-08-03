const randomBetween = require('../lib/random');

class Enemy {
  constructor(props, area) {
    this.type = 'normal';
    this.radius = props.radius;
    this.speed = props.speed;
    this.pos = [
      randomBetween(this.radius, area.defaults.width - this.radius),
      randomBetween(this.radius, area.defaults.height - this.radius),
    ];
    this.angle = Math.random() * Math.PI * 2;
    this.vel = [Math.cos(this.angle) * this.speed, Math.sin(this.angle) * this.speed];
    this.friction = 0;
  }

  /**
   * Update enemy
   * @param {number} delta
   * @param {List<Player>} players
   */
  update(delta, players) {
    const timeFix = delta / (1000 / 30);
    this._behavior(delta, players);
    this._move(timeFix);
  }

  /**
   * Behavior of enemy
   * @param {number} delta
   * @param {List<Player>} players
   */
  _behavior(delta, players) {}

  _move(timeFix) {
    this.pos[0] += this.vel[0] * timeFix;
    this.pos[1] += this.vel[1] * timeFix;

    let dim = 1 - this.friction * timeFix;
    this.vel[0] *= dim;
    this.vel[1] *= dim;

    this.pos[0] = Math.round(this.pos[0] * 10) / 10;
    this.pos[1] = Math.round(this.pos[1] * 10) / 10;
  }
}

module.exports = Enemy;
