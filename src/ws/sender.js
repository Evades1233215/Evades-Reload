const format = require('../lib/formatSend');
const { packPlayer, packEnemy } = require('../lib/pack');
const logger = require('../logger');
const worldManager = require('../managers/world');

class Sender {
  constructor(clients) {
    this.oldPlayers = {};
    // Structure
    // worldName: [ area -> [ enemies -> {pos: [0,0], type: ''} ]]
    this.oldWorlds = {};
    this.clients = clients;
  }

  sendMsg(id, name, data) {
    if (Object.keys(data).length < 1 || !data) return;
    try {
      this.clients[id]._client.send(format(name, data));
    } catch (e) {
      logger.error(`Error with sending package: ${e}`);
    }
  }

  boardCastMsg(name, data) {
    for (const i in this.clients) {
      try {
        this.clients[i]._client.send(format(name, data));
      } catch (e) {
        logger.error(`Error with sending package: ${e}`);
      }
    }
  }

  // startSend(id, { area, world }) {
  //   // this.sendMsg(id, 'area', {
  //   //   width: area.properties,
  //   //   height: world.mjson.datas,
  //   //   colorFill: '#000',
  //   //   colorAlpha: 0.25,
  //   // });
  //   // this.sendMsg(id, 'world', {
  //   //   name: 'Strange Station',
  //   //   titleFill: '#fff',
  //   //   titleStroke: '#555',
  //   // });
  // }

  // sendTeleport(id, { a, w }) {
  //   // let areaSend = a.startSend();
  //   // this.sendMsg(id, 'newArea', {
  //   //   area: a.ajson.properties,
  //   //   world: w.mjson.datas,
  //   //   zones: areaSend.zones,
  //   //   entities: areaSend.entities,
  //   // });
  // }

  _joinArea(id, players) {
    const enemies = [];
    const area = worldManager.getArea(players[id]);
    for (const i in area.enemies) {
      enemies.push(packEnemy(area.enemies[i]));
    }
    this.sendMsg(id, 'newEnemies', enemies);
    this.sendMsg(id, 'joinArea', {
      ...area.defaults,
      area: players[id].area,
      world: players[id].world,
    });
  }

  /**
   *
   * @param {number} id
   * @param {List<Players>} players
   * @param {worldManager} worldManager
   */
  joinPlayer(id, players) {
    let packs = {};
    for (let p in players) packs[p] = packPlayer(players[p]);
    this.sendMsg(id, 'players', packs);
    this._joinArea(id, players, worldManager);
  }

  /**
   * Sends close package to all clients
   * @param {number} id
   */
  leavePlayer(id) {
    this.boardCastMsg('closePlayer', id);
  }

  sendUpdate(players) {
    let pPacks = {};
    let teleportedPlayers = [];
    for (let p in players) {
      let newData = packPlayer(players[p]);
      if (this.oldPlayers[p] != undefined) {
        pPacks[p] = {};
        for (let element in newData) {
          let el = newData[element];
          if (typeof el !== 'object') {
            if (el != this.oldPlayers[p][element]) pPacks[p][element] = el;
          } else {
            if (
              el[0] !== this.oldPlayers[p][element][0] ||
              el[1] !== this.oldPlayers[p][element][1]
            ) {
              pPacks[p][element] = el;
            }
          }
        }
        if (Object.keys(pPacks[p]).includes('world') || Object.keys(pPacks[p]).includes('area'))
          teleportedPlayers.push(p);
        if (Object.keys(pPacks[p]).length === 0) delete pPacks[p];
      } else {
        pPacks[p] = packPlayer(players[p]);
        this.joinPlayer(p, players);
      }

      this.oldPlayers[p] = JSON.parse(JSON.stringify(newData));
    }

    const updatedWorlds = {};
    for (const w in worldManager._worlds) {
      const world = worldManager._worlds[w];
      if (this.oldWorlds[w] === undefined) {
        this.oldWorlds[w] = {};
      }
      updatedWorlds[w] = {};
      for (const a in world) {
        const area = world[a];
        if (this.oldWorlds[w][a] === undefined) {
          this.oldWorlds[w][a] = area.enemies.map((v) => packEnemy(v));
          updatedWorlds[w][a] = area.enemies.map((v) => packEnemy(v));
          continue;
        }
        updatedWorlds[w][a] = [];
        for (const e in area.enemies) {
          const newData = packEnemy(area.enemies[e]);
          if (this.oldWorlds[w][a][e] === undefined) {
            this.oldWorlds[w][a][e] = newData;
            updatedWorlds[w][a][e] = newData;
            continue;
          }
          updatedWorlds[w][a][e] = {};
          for (let element in newData) {
            let el = newData[element];
            if (typeof el !== 'object') {
              if (el != this.oldWorlds[w][a][e][element]) updatedWorlds[w][a][e][element] = el;
            } else {
              if (
                el[0] !== this.oldWorlds[w][a][e][element][0] ||
                el[1] !== this.oldWorlds[w][a][e][element][1]
              )
                updatedWorlds[w][a][e][element] = el;
            }
          }
          this.oldWorlds[w][a][e] = JSON.parse(JSON.stringify(newData));
        }
        updatedWorlds[w][a] = updatedWorlds[w][a].filter((v) => v.length !== 0);
      }
    }

    if (Object.keys(pPacks).length !== 0) {
      this.boardCastMsg('updatePlayers', pPacks);
      for (const i in teleportedPlayers) this._joinArea(teleportedPlayers[i], players);

      console.log(pPacks);
    }

    for (const p in players) {
      const player = players[p];
      if (
        updatedWorlds[player.world][player.area] !== undefined &&
        updatedWorlds[player.world][player.area].length !== 0
      )
        this.sendMsg(p, 'updateEnemies', updatedWorlds[player.world][player.area]);
    }

    //this.oldPlayers = {}
    //this.oldPlayers = JSON.parse(JSON.stringify(players))
  }
}

module.exports = { Sender };
