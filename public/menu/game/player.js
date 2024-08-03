const SCALE_DISTANCE = 200;
const DEATH_TIME = 60;

class Player {
  position;
  speed;
  radius;
  color;
  bounds;
  ctx;
  input;
  name;
  deathIn;
  game;


  constructor(position, speed, bounds, radius, color, name, ctx, game) {
    this.game = game;
    this.position = position;
    this.speed = speed;
    this.bounds = bounds;
    this.radius = radius;
    this.color = color;
    this.name = name;
    this.ctx = ctx;
    this.deathIn = undefined;

    this.input = {
      keyboard: {
        top: false,
        bottom: false,
        left: false,
        right: false,
        shift: false
      },
      mouse: {
        lmb: false,
        rmb: false,
        position: { x: 0, y: 0 }
      }
    }

    this.init();
  }

  init() {
    document.addEventListener('keydown', this.onKeyDown.bind(this));
    document.addEventListener('keyup', this.onKeyUp.bind(this));
    this.game.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
    this.game.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.game.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.game.canvas.addEventListener('contextmenu', e => e.preventDefault());
  }

  onKeyDown(e) {
    if (e.code == 'KeyR') {
      this.isDeath = false;
      //  this.position = { x: 0, y: 0 }
    }
    if (['ArrowUp', 'KeyW'].includes(e.code)) this.input.keyboard.top = true;
    if (['ArrowDown', 'KeyS'].includes(e.code)) this.input.keyboard.bottom = true;
    if (['ArrowLeft', 'KeyA'].includes(e.code)) this.input.keyboard.left = true;
    if (['ArrowRight', 'KeyD'].includes(e.code)) this.input.keyboard.right = true;
    if (e.code.includes('Shift')) this.input.keyboard.shift = true;
  }

  onKeyUp(e) {
    if (['ArrowUp', 'KeyW'].includes(e.code)) this.input.keyboard.top = false;
    if (['ArrowDown', 'KeyS'].includes(e.code)) this.input.keyboard.bottom = false;
    if (['ArrowLeft', 'KeyA'].includes(e.code)) this.input.keyboard.left = false;
    if (['ArrowRight', 'KeyD'].includes(e.code)) this.input.keyboard.right = false;
    if (e.code.includes('Shift')) this.input.keyboard.shift = false;
  }

  onMouseUp(e) {
    switch (e.button) {
      case 0:
        this.input.mouse.lmb = false; break;
      case 2:
        this.input.mouse.rmb = false; break;
    }
  }
  onMouseDown(e) {
    switch (e.button) {
      case 0:
        this.input.mouse.lmb = true; break;
      case 2:
        this.input.mouse.rmb = true; break;
    }
  }
  onMouseMove(e) { this.input.mouse.position.x = e.x - this.game.canvas.width / 2; this.input.mouse.position.y = e.y - this.game.canvas.height / 2; }

  update() {
    const direction = { x: 0, y: 0 };
    let speed = this.speed;

    if (this.input.keyboard.top) direction.y--;
    if (this.input.keyboard.bottom) direction.y++;
    if (this.input.keyboard.left) direction.x--;
    if (this.input.keyboard.right) direction.x++;

    if (!direction.x && !direction.y && this.input.mouse.lmb) {
      const angle = Math.atan2(this.input.mouse.position.y, this.input.mouse.position.x);
      direction.x = Math.cos(angle);
      direction.y = Math.sin(angle);

      const distance = Math.sqrt(this.input.mouse.position.x ** 2 + this.input.mouse.position.y ** 2);
      if (distance < SCALE_DISTANCE) speed *= distance / SCALE_DISTANCE;
    }

    if (!this.deathIn) {
      this.position.x += direction.x * (this.input.keyboard.shift ? speed * 0.35 : speed);
      this.position.y += direction.y * (this.input.keyboard.shift ? speed * 0.35 : speed);

      if (this.position.x - this.radius < this.bounds.a.x) this.position.x = this.bounds.a.x + this.radius;
      if (this.position.x + this.radius > this.bounds.b.x) this.position.x = this.bounds.b.x - this.radius;
      if (this.position.y - this.radius < this.bounds.a.y) this.position.y = this.bounds.a.y + this.radius;
      if (this.position.y + this.radius > this.bounds.b.y) this.position.y = this.bounds.b.y - this.radius;
    }
  }

  destroy() {
    document.removeEventListener('keydown', this.onKeyDown.bind(this));
    document.removeEventListener('keyup', this.onKeyUp.bind(this));

  }

  draw(mainPlayer, canvas) {
    const position = { x: mainPlayer.position.x - this.position.x + canvas.width / 2, y: mainPlayer.position.y - this.position.y + canvas.height / 2 }

    this.ctx.beginPath();
    this.ctx.fillStyle = this.color.toRgba(undefined, undefined, undefined, this.deathIn ? 0.5 : 1);
    this.ctx.arc(position.x, position.y, this.radius, 0, Math.PI * 2);
    this.ctx.fill();

    // Name
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "bottom";
    this.ctx.fillStyle = 'black';
    this.ctx.font = '16px sans-serif';

    this.ctx.fillText(this.name, position.x, position.y - this.radius - 2);
    this.ctx.closePath();

    if (this.deathIn !== undefined) this.drawDeathTimer(position);

  }

  drawDeathTimer(position) {
    this.ctx.fillStyle = 'red';
    this.ctx.textBaseline = "middle";
    this.ctx.font = `${this.radius * 1.25}px sans-serif`;

    const deathTimerS = DEATH_TIME - new Date(Date.now() - this.deathIn).getSeconds();
    if (deathTimerS == 0) location.reload();
    this.ctx.fillText(`${deathTimerS}`, position.x, position.y);
  }

  onCollisionWithBall(ball) {
    if (this.deathIn === undefined) this.deathIn = Date.now();

  }
}