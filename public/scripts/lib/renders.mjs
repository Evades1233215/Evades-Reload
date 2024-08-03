function renderPlayer(ctx, p, offset) {
    ctx.beginPath();
    ctx.globalAlpha = 1;
    ctx.lineWidth = 1;
    ctx.fillStyle = 'blue';
    ctx.fillRect(
      p.pos[0] - 18 - offset[0],
      p.pos[1] - (p.radius + 8) - offset[1],
      36 * (p.energy / p.maxEnergy),
      7
    );
    ctx.strokeStyle = 'rgb(68, 118, 255)';
    ctx.strokeRect(p.pos[0] - 18 - offset[0], p.pos[1] - (p.radius + 8) - offset[1], 36, 7);
    ctx.closePath();
  
    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.font = '12px Tahoma, Verdana, Segoe, sans-serif';
    ctx.fillText(p.name, p.pos[0] - offset[0], p.pos[1] - (p.radius + 11) - offset[1]);
    ctx.closePath();
  
    ctx.beginPath();
    ctx.fillStyle = 'red';
    ctx.globalAlpha = p.downed ? 0.4 : 1;
    ctx.arc(p.pos[0] - offset[0], p.pos[1] - offset[1], p.radius, 0, 6.29);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.closePath();
  }
  
  function renderEnemy(ctx, e, offset, renderData) {
    if (renderData == null) return;
    ctx.beginPath();
    ctx.strokeStyle = '#000';
    ctx.fillStyle = renderData.enemies[e.type] ?? '#787878';
    ctx.lineWidth = 2;
    ctx.arc(e.pos[0] - offset[0], e.pos[1] - offset[1], e.radius, 0, 6.29);
    ctx.stroke();
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.closePath();
  }
  
  export { renderPlayer, renderEnemy };
  