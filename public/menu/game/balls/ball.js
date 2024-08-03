class Ball {
    type;
    position;
    speed;
    radius;
    velocity;
    bounds; // { a: vec, b: vec } 
    color;
    ctx;
  
    constructor(position, speed, radius, color, bounds, type, ctx) {
      this.position = position;
      this.speed = speed;
      this.radius = radius;
      this.type = type;
      this.bounds = bounds;
      this.color = color;
      this.ctx = ctx;
  
      const angle = Math.random() * Math.PI * 2;
      this.velocity = { x: Math.cos(angle) * this.speed, y: Math.sin(angle) * this.speed }
  
    }
  
    update() {
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
  
      if (this.position.x - this.radius < this.bounds.a.x) {
        this.velocity.x *= -1;
        this.position.x = this.bounds.a.x + this.radius;
      }
      if (this.position.x + this.radius > this.bounds.b.x) {
        this.velocity.x *= -1;
        this.position.x = this.bounds.b.x - this.radius;
      }
      if (this.position.y - this.radius < this.bounds.a.y) {
        this.velocity.y *= -1;
        this.position.y = this.bounds.a.y + this.radius;
      }
      if (this.position.y + this.radius > this.bounds.b.y) {
        this.velocity.y *= -1;
        this.position.y = this.bounds.b.y - this.radius;
      }
    }
  
    checkCollisionWithPlayer(player) {
      const distance = Math.sqrt((this.position.x - player.position.x) ** 2 + (this.position.y - player.position.y) ** 2);
      if (distance < this.radius + player.radius) player.onCollisionWithBall(this);
    }
  
    draw(mainPlayer, canvas) {
      const position = { x: -mainPlayer.position.x + this.position.x + canvas.width / 2, y: -mainPlayer.position.y + this.position.y + canvas.height / 2 }
  
      this.ctx.beginPath();
      this.ctx.fillStyle = this.color.toRgba();
      this.ctx.arc(position.x, position.y, this.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.closePath();
    }
  }