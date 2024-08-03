const logger = require('../logger');
const path = require('path');
const fs = require('fs');
const Enemy = require('../classes/enemy');
const {
  collideEnemyWithWalls,
  interactEnemyWithPlayer,
  interactPlayerWithPlayer,
} = require('../lib/collide');
const config = require('../config');
const { processTeleports } = require('../lib/teleportUtils');
const { spawnData } = require('../consts');

class WorldManager {
  constructor() {
    this._rawWorlds = {};
    this._loadWorlds();
    logger.info('Worlds is loaded');
    this._worlds = {};
    this._preparateWorlds();
  }

  update(delta, players) {
    for (const w in this._worlds) {
      const world = this._worlds[w];
      for (const a in world) {
        const area = world[a];
        processTeleports.bind(this)(area, players);
        const playersInArea = area.players.map((e) => players[e]);
        for (const e in area.enemies) {
          const enemy = area.enemies[e];
          enemy.update(delta, playersInArea);
          collideEnemyWithWalls(enemy, area);
          for (const p in area.players) {
            const player = players[area.players[p]];
            if (!player.downed) interactEnemyWithPlayer(enemy, player);
            for (const p2 in area.players) {
              if (p2 != p)
                interactPlayerWithPlayer(players[area.players[p]], players[area.players[p2]]);
            }
          }
        }
      }
    }
  }

  /**
   * Returns area
   * @param {Player} player
   */
  getArea(player) {
    if (!this._worlds[player.world][player.area]) {
      logger.error('Error on getting area of player. This may lead to errors');
      return;
    }
    return this._worlds[player.world][player.area];
  }

  /**
   * Teleports player
   * @param {Player} player
   * @param {string} world
   * @param {string | number} area
   */
  teleport(player, world, area) {
    this._leaveArea(player.world, player.area, player.id);
    this._joinArea(world, area, player.id);
  }

  /**
   * Process joining player in game
   * @param {Player} player
   */
  join(player) {
    this._joinArea(player.world, player.area, player.id);
  }

  /**
   * Process leaving player from game
   * @param {Player} player
   */
  leave(player) {
    this._leaveArea(player.world, player.area, player.id);
  }

  _loadWorlds() {
    const worldsPath = path.join(path.dirname(__dirname), '../worlds/');
    fs.readdirSync(worldsPath).map((fileName) => {
      const file = fs.readFileSync(worldsPath + fileName) + '';
      const parsed = JSON.parse(file);
      if (Object.keys(this._rawWorlds).includes(parsed.general.name))
        throw new Error(`Duplicate world name, with fileName: ${fileName}`);
      this._rawWorlds[parsed.general.name] = {};
      for (const i in parsed.areas) {
        const v = parsed.areas[i];
        const areaDefaults = v.defaults;
        if (areaDefaults !== undefined) {
          if (Object.keys(areaDefaults).includes('width'))
            areaDefaults['width'] = areaDefaults['width'] * 32;
          if (Object.keys(areaDefaults).includes('height'))
            areaDefaults['height'] = areaDefaults['height'] * 32;
        }
        this._rawWorlds[parsed.general.name][i] = {
          defaults: {
            ...parsed.general.defaults,
            width: parsed.general.defaults.width * 32,
            height: parsed.general.defaults.height * 32,
            ...areaDefaults,
          },
          enemies: v.enemies,
        };
      }
    });
  }

  _preparateWorlds() {
    for (const i in config.world.worldList) {
      const name = config.world.worldList[i];
      if (this._rawWorlds[name] === undefined)
        throw new Error(`World with name ${name} does not loaded`);
    }
    for (const i in this._rawWorlds) {
      this._worlds[i] = {};
    }
  }

  _joinArea(world, area, id) {
    if (this._worlds[world][area] === undefined) {
      this._worlds[world][area] = {
        players: [id],
        enemies: this._spawnEnemies(this._rawWorlds[world][area]),
        defaults: this._rawWorlds[world][area].defaults,
      };
    } else {
      this._worlds[world][area].players.push(id);
    }
  }

  _leaveArea(world, area, id) {
    if (this._worlds[world][area] === undefined) {
      logger.error(`Leaving area error: World ${world} Area ${area}, is not exists?!`);
      return;
    }
    this._worlds[world][area].players = this._worlds[world][area].players.filter((v) => v !== id);
    if (this._worlds[world][area].players.length === 0) delete this._worlds[world][area];
  }

  _spawnEnemies(rawArea) {
    let enemies = [];
    for (const i in rawArea.enemies) {
      for (let v = 0; v < rawArea.enemies[i].count; v++) {
        const EnemyConstructor = spawnData.enemies[rawArea.enemies[i].type];
        if (EnemyConstructor) enemies.push(new EnemyConstructor(rawArea.enemies[i], rawArea));
        else enemies.push(new Enemy(rawArea.enemies[i], rawArea));
      }
    }
    return enemies;
  }
}

const worldManager = new WorldManager();

module.exports = worldManager;
