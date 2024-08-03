const config = require('../config');
const { renderData } = require('../consts');
const format = require('../lib/formatSend');
const logger = require('../logger');

class Client {
  selfId = 0;

  constructor(client, id, joinCallback, boardCastCallback) {
    this.selfId = id;
    this._client = client;
    this.movement = {
      isShift: false,
      KeyW: false,
      KeyS: false,
      KeyA: false,
      KeyD: false,
      mouseEnable: false,
      mousePos: [0, 0],
    };
    this.logged = false;

    this._client.send(format('init', { ...config.client, id, renderData }));

    client.on('message', (msg) => {
      try {
        const data = JSON.parse(msg);
        switch (Object.keys(data)[0]) {
          case 'keyPress':
            const keyPress = data.keyPress;
            if (
              typeof keyPress === 'object' &&
              typeof keyPress.key === 'string' &&
              typeof keyPress.val === 'boolean'
            ) {
              this.movement[keyPress.key] = keyPress.val;
            }
            break;
          case 'mouse':
            const mouse = data.mouse;
            if (typeof mouse !== 'object') return;
            if (mouse.enable !== undefined && typeof mouse.enable === 'boolean')
              this.movement.mouseEnable = mouse.enable;
            if (
              mouse.pos !== undefined &&
              typeof mouse.pos === 'object' &&
              typeof mouse.pos[0] === 'number' &&
              typeof mouse.pos[1] === 'number'
            ) {
              this.movement.mousePos[0] = mouse.pos[0];
              this.movement.mousePos[1] = mouse.pos[1];
            }
            break;
          case 'join':
            const join = data.join;
            if (
              typeof join !== 'object' ||
              join.name === undefined ||
              join.heroId === undefined ||
              typeof join.name !== 'string' ||
              typeof join.heroId !== 'number'
            )
              return;
            joinCallback(
              {
                name: join.name,
                id: this.selfId,
              },
              join.heroId
            );
            this.logged = true;
            this._client.send(format('status', 'true'));
            break;
          case 'message':
            const message = data.message;
            if (typeof message === 'string')
              if (this.logged) boardCastCallback('message', { author: id, content: message });
            break;
        }
      } catch (e) {
        logger.error(`Error in accepting message from client: ${e}`);
        console.log(e);
      }
    });
  }
}

module.exports = Client;
