/**
 * From evade2.herokuapp.com
 */
function interpolate(start, end, delta) {
    if (false) return end;
    if (Math.abs(start - end) > 100) return end;
  
    let lerpto = delta / (1000 / 30);
    let dx = end - start;
    return start + dx * lerpto;
  }
  
  function interpSomething(delta) {
    this.pos[0] = Math.ceil(interpolate(this.pos[0], this.rpos[0], delta) * 10) / 10;
    this.pos[1] = Math.ceil(interpolate(this.pos[1], this.rpos[1], delta) * 10) / 10;
  }
  export { interpSomething };
  