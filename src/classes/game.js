const { collideWithWalls } = require('../lib/collide');
const worldManager = require('../managers/world');
const WorldManager = require('../managers/world');
const Player = require('./player');

class Game {
  constructor() {
    this.players = {};
  }

  update(delta, getClients) {
    const clients = getClients();
    for (const i in this.players) {
      this.players[i].move(clients[i].movement);
      this.players[i].update(delta);
      if (worldManager.getArea(this.players[i]))
        collideWithWalls(this.players[i], worldManager.getArea(this.players[i]));
    }
    worldManager.update(delta, this.players);
  }

  joinPlayer(data, heroId) {
    if (this.players[data.id] === undefined) {
      this.players[data.id] = new Player(data);
      worldManager.join(this.players[data.id]);
    }
  }

  leavePlayer(id) {
    if (this.players[id] !== undefined) {
      worldManager.leave(this.players[id]);
      delete this.players[id];
    }
  }

  teleport(id, world, area) {
    worldManager.teleport(this.players[id], world, area);
    this.players[id].world = world;
    this.players[id].area = area;
  }
}

module.exports = Game;
