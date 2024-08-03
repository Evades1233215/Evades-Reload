const pino = require('pino');
const path = require('path');
const fs = require('fs');

const streams = [
  // {
  //   level: 'info',
  //   stream: fs.createWriteStream(path.dirname(__dirname) + '/log/info.log', { flags: 'a' }),
  // },
  // {
  //   level: 'error',
  //   stream: fs.createWriteStream(path.dirname(__dirname) + '/log/error.log', { flags: 'a' }),
  // },
];

module.exports = pino({ level: 'info' });
