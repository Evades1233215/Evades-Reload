class Game {
    balls;
    player;
    area;
    saveZoneWidth;
    canvas;
    startIn;
  
    constructor(ballsCount, area, saveZoneWidth, playerName) {
      this.startIn = Date.now();
      this.canvas = document.body.appendChild(document.createElement('canvas'));
      this.ctx = this.canvas.getContext('2d');
  
      this.area = area;
      this.saveZoneWidth = saveZoneWidth;
      this.balls = new Set();
  
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
  
  
      const ballBounds = { a: { x: saveZoneWidth, y: 0, }, b: { x: this.area.width - this.saveZoneWidth, y: this.area.height } };
      for (let i = 0; i < ballsCount; i++) {
        const radius = 5 + 40 * Math.random();
        const position = { x: saveZoneWidth + radius + Math.random() * (this.area.width - saveZoneWidth * 2 - radius), y: radius + Math.random() * (this.area.height - radius) }
        this.balls.add(new Ball(position, 2, radius, new Color(147, 147, 147), ballBounds, 'type', this.ctx));
      }
  
      this.player = new Player({ x: 20, y: 320 }, 3, { a: { x: 0, y: 0 }, b: { x: this.area.width, y: this.area.height } }, 18, new Color(200, 0, 0)/* old -> '#FF5454'*/, playerName, this.ctx, this);
    }
  
    update() {
      this.balls.forEach(ball => {
        ball.update();
        ball.checkCollisionWithPlayer(this.player);
      });
      this.player.update();
    }
  
    render() {
      this.update();
  
      const position = { x: -this.player.position.x + this.canvas.width / 2, y: -this.player.position.y + this.canvas.height / 2 }
  
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.ctx.beginPath()
      this.ctx.fillStyle = 'white';
      this.ctx.fillRect(position.x, position.y, this.area.width, this.area.height);
      this.ctx.fillStyle = 'gray';
      this.ctx.fillRect(position.x, position.y, this.saveZoneWidth, this.area.height);
      this.ctx.fillRect(position.x + this.area.width - this.saveZoneWidth, position.y, this.saveZoneWidth, this.area.height);
      this.ctx.closePath();
  
      
  
      this.player.draw(this.player, this.canvas);
      this.balls.forEach(ball => ball.draw(this.player, this.canvas));
  
      this.drawTimer();
  
      window.requestAnimationFrame(this.render.bind(this));
    }
  
    drawTimer() {
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "bottom";
      this.ctx.fillStyle = 'black';
      this.ctx.font = '36px arial';
  
      const date = new Date(Date.now() - this.startIn);
      this.ctx.fillText(date.getMinutes() + ':' + date.getSeconds(), this.canvas.width / 2, this.canvas.height / 6)
    }
  }