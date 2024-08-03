const WebSocket = require('wss');
const logger = require('./logger');
const config = require('./config');
const Client = require('./ws/client');
const Game = require('./classes/game');
const { Sender } = require('./ws/sender');

class WsServer {
  constructor(httpServer) {
    this.nextId = 0;
    this.clients = {};
    this.game = new Game();
    this.ws = WebSocket.createServerFrom(httpServer);
    this.sender = new Sender(this.clients);
    this.ws.on('open', () => {
      logger.info('WebSocket server, is normally started');
    });
    this.ws.on('error', (err) => {
      logger.error(err);
    });
    this.ws.on('connection', (conn) => {
      logger.info('Some-one is connected');
      const id = this.nextId + 0;
      this.clients[id] = new Client(
        conn,
        id,
        this.game.joinPlayer.bind(this.game),
        this.sender.boardCastMsg.bind(this.sender)
      );
      conn.on('close', () => {
        delete this.clients[id];
        this.game.leavePlayer(id);
        this.sender.leavePlayer(id);
      });
      this.nextId++;
    });

    let lastUpdateTime = Date.now();
    setInterval(() => {
      let currentTime = Date.now();
      let delta = currentTime - lastUpdateTime;
      lastUpdateTime = currentTime;
      this.game.update(delta, (() => this.clients).bind(this));
      this.sender.sendUpdate(this.game.players);
    }, config.server.tickRate);
  }
}

module.exports = WsServer;
