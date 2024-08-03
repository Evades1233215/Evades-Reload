const express = require('express');
const http = require('http');
const path = require('path');
const logger = require('./logger');
const WsServer = require('./ws');
const { default: helmet } = require('helmet');

const app = express();
const httpServer = http.Server(app);

const port = 4000;

app.set('port', port);

app.use(helmet());

app.use('/scripts', (req, res, next) => {
  if (req.method === 'GET') {
    res.sendFile(path.dirname(__dirname) + '/public/scripts' + req.path + '.mjs');
    return;
  }
  next();
});
app.use('/styles', express.static(path.dirname(__dirname) + '/public/styles'));
app.use('/assets', express.static(path.dirname(__dirname) + '/public/assets'));

app.get('/', (_, res) => {
  res.sendFile(path.dirname(__dirname) + '/public/index.html');
});

httpServer.listen(port, () => {
  logger.info(`Evades Reload http server is started! Port: ${port}`);
});

const ws = new WsServer(httpServer);
