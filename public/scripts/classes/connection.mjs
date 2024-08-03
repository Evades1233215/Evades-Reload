import { connection } from '../config';
import Enemy from './enemy';
import { Game } from './game';
import Player from './player';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

class Connection {
  constructor() {
    this.game = new Game();
    this.frameId = 0;
    this.inGame = false;
  }

  createConnection(updateDomCallback, showOrHideGame, addMessageCallback) {
    this.ws = new WebSocket(connection.url);
    this.ws.onopen = () => {};
    this.ws.onerror = () => {};
    this.ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      switch (Object.keys(data)[0]) {
        case 'init':
          updateDomCallback(data.init);
          this.game.selfId = data.init.id;
          this.game.renderData = data.init.renderData;
          break;
        case 'status':
          this.inGame = data.status;
          showOrHideGame(this.inGame);
          if (this.inGame) render();
          break;
        case 'updatePlayers':
          const updatePlayers = data.updatePlayers;
          for (const i in updatePlayers) {
            if (this.game.players[i] === undefined) {
              this.game.players[i] = new Player(updatePlayers[i]);
            } else this.game.players[i].update(updatePlayers[i]);
          }
          break;
        case 'players':
          const players = data.players;
          for (const i in players) {
            this.game.players[i] = new Player(players[i]);
          }
          break;
        case 'newEnemies':
          const newEnemies = data.newEnemies;
          this.game.enemies = [];
          for (const e in newEnemies) {
            this.game.enemies[e] = new Enemy(newEnemies[e]);
          }
          this.game.players[this.game.selfId].pos = this.game.players[this.game.selfId].rpos;
          break;
        case 'updateEnemies':
          const updateEnemies = data.updateEnemies;
          for (const e in updateEnemies) {
            this.game.enemies[e].update(updateEnemies[e]);
          }
          break;
        case 'closePlayer':
          const id = data.closePlayer;
          delete this.game.players[id];
          break;
        case 'joinArea':
          const joinArea = data.joinArea;
          this.game.defaults = joinArea;
          if (joinArea.areaType === 'victory') this.game.enemies = [];
          this.game.players[this.game.selfId].pos = this.game.players[this.game.selfId].rpos;
          break;
        case 'message':
          const message = data.message;
          addMessageCallback({
            author: this.game.players[message.author].name,
            content: message.content,
            color: '#fff',
          });
          break;
        default:
          console.log(data);
          break;
      }
    };
    this.ws.onclose = () => {
      this.inGame = false;
      showOrHideGame(false);
    };
  }

  startGame(username, heroId) {
    if (this.ws === undefined || this.inGame) return;
    this.ws.send(`{"join": {"name":"${username}","heroId":${heroId}}}`);
  }

  keyPress(key, val) {
    this.ws.send(`{"keyPress": {"key":"${key}","val":${val}}}`);
  }

  sendChatMessage(msg) {
    this.ws.send(`{"message": "${msg}"}`);
  }

  mouse(object) {
    this.ws.send(JSON.stringify({ mouse: object }));
  }
}

const instance = new Connection();

let lastTimeUpdate = Date.now();

function render() {
  if (instance.ws == undefined && !instance.inGame) return;
  let curTimeUpdate = Date.now();
  instance.game.render(ctx, curTimeUpdate - lastTimeUpdate);
  lastTimeUpdate = curTimeUpdate;
  requestAnimationFrame(render);
}

export default instance;
