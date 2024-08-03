const Enemy = require('../classes/enemy');

class Normal extends Enemy {
  constructor(props, area) {
    super(props, area);
    this.type = 'normal';
  }
}

module.exports = Normal;
