import { canvas, resolution, area } from '../config';
import { interpSomething } from '../lib/lerp';
import { renderPlayer, renderEnemy } from '../lib/renders';

class Game {
  constructor() {
    this.players = {};
    this.enemies = [];
    this.renderData = null;
    this.defaults = {
      width: 80 * 32,
      height: 15 * 32,
      fillStyle: '#20547A',
      strokeStyle: '#153852',
      colorFill: '#000',
      colorAlpha: 0.25,
      area: 1,
      world: 'Strange Station',
      areaType: 'transition',
      message: [],
    };
    this.offset = [0, 0];
    this.selfId = 0;
  }

  render(ctx, delta) {
    ctx.beginPath();
    ctx.fillStyle = canvas.bgColor;
    ctx.fillRect(0, 0, resolution.width, resolution.height);
    ctx.closePath();

    if (this.players[this.selfId] === undefined) return;
    this._follow(this.players[this.selfId]);

    this._render_area(ctx);

    for (const i in this.players)
      if (
        this.players[i].world === this.defaults.world &&
        this.players[i].area == this.defaults.area
      ) {
        renderPlayer(ctx, this.players[i], this.offset);
        interpSomething.bind(this.players[i])(delta);
      }
    for (const i in this.enemies) {
      renderEnemy(ctx, this.enemies[i], this.offset, this.renderData);
      interpSomething.bind(this.enemies[i])(delta);
    }

    this._render_labels(ctx);
  }

  _render_area(ctx) {
    ctx.beginPath();
    ctx.fillStyle = '#FFF46C';
    if (this.defaults.areaType === 'transition') {
      ctx.fillRect(
        -area.safeZoneWidth - this.offset[0],
        -this.offset[1],
        area.safeZoneWidth,
        area.teleportSize
      );
      ctx.fillRect(
        -area.safeZoneWidth - this.offset[0],
        this.defaults.height - area.teleportSize - this.offset[1],
        area.safeZoneWidth,
        area.teleportSize
      );
    } else {
      ctx.fillRect(
        -area.safeZoneWidth - this.offset[0],
        -this.offset[1],
        area.teleportSize,
        this.defaults.height
      );
    }
    ctx.fillRect(
      this.defaults.width + area.safeZoneWidth - area.teleportSize - this.offset[0],
      -this.offset[1],
      area.teleportSize,
      this.defaults.height
    );
    if (this.defaults.areaType !== 'victory') {
      ctx.fillStyle = '#C1C1C1';
      if (this.defaults.areaType === 'transition')
        ctx.fillRect(
          -area.safeZoneWidth - this.offset[0],
          area.teleportSize - this.offset[1],
          area.safeZoneWidth,
          this.defaults.height - area.teleportSize * 2
        );
      else
        ctx.fillRect(
          -area.safeZoneWidth + area.teleportSize - this.offset[0],
          -this.offset[1],
          area.safeZoneWidth - area.teleportSize,
          this.defaults.height
        );
      ctx.fillRect(
        this.defaults.width - this.offset[0],
        -this.offset[1],
        area.safeZoneWidth - area.teleportSize,
        this.defaults.height
      );
      ctx.fillStyle = '#fff';
      ctx.fillRect(-this.offset[0], -this.offset[1], this.defaults.width, this.defaults.height);
    } else {
      ctx.fillStyle = '#FFF46C';
      ctx.fillRect(
        area.teleportSize - area.safeZoneWidth - this.offset[0],
        -this.offset[1],
        this.defaults.width + area.safeZoneWidth * 2 - area.teleportSize,
        this.defaults.height
      );
      ctx.fillStyle = '#FFFABA';
      ctx.fillRect(
        this.defaults.width + area.safeZoneWidth - area.teleportSize - this.offset[0],
        -this.offset[1],
        area.teleportSize,
        this.defaults.height
      );
    }
    ctx.fillStyle = this.defaults.colorFill;
    ctx.globalAlpha = this.defaults.colorAlpha;
    ctx.fillRect(
      -area.safeZoneWidth - this.offset[0],
      -this.offset[1],
      this.defaults.width + area.safeZoneWidth * 2,
      this.defaults.height
    );
    ctx.globalAlpha = 1;
    ctx.closePath();
  }

  /**
   * @param {CanvasRenderingContext2D} ctx
   */
  _render_labels(ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.defaults.fillStyle;
    ctx.strokeStyle = this.defaults.strokeStyle;
    ctx.lineWidth = 6;
    ctx.font = 'bold 35px Tahoma, Verdana, Segoe, sans-serif';
    ctx.textAlign = 'center';
    const area = Number.isNaN(this.defaults.area)
      ? this.defaults.area
      : `Area ${this.defaults.area}`;
    ctx.strokeText(`${this.defaults.world}: ${area}`, resolution.width / 2, 40);
    ctx.fillText(`${this.defaults.world}: ${area}`, resolution.width / 2, 40);
    ctx.fillStyle = '#00ff6b';
    ctx.strokeStyle = '#006b2c';
    if (this.defaults.message && this.defaults.message.length !== 0) {
      for (let i = 0; i < this.defaults.message.length; i++) {
        ctx.strokeText(
          this.defaults.message[i],
          resolution.width / 2,
          resolution.height - 120 + 40 * i
        );
        ctx.fillText(
          this.defaults.message[i],
          resolution.width / 2,
          resolution.height - 120 + 40 * i
        );
      }
    }
    ctx.lineWidth = 1;
    ctx.closePath();
  }

  _follow(player) {
    this.offset = [player.pos[0] - resolution.width / 2, player.pos[1] - resolution.height / 2];
  }
}

export { Game };
