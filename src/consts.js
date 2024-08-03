const Homing = require('./enemies/homing');
const Normal = require('./enemies/normal');
const Shutter = require('./enemies/shutter');

const renderData = {
  enemies: {
    normal: '#787878',
    shutter: '#003c66',
    homing: '#A0780A',
  },
};

const spawnData = {
  enemies: {
    normal: Normal,
    shutter: Shutter,
    homing: Homing,
  },
};

module.exports = { renderData, spawnData };
