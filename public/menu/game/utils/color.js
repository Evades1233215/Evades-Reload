class Color {
    r;
    g;
    b;
    a;
    
    constructor(r, g, b, a = 1) {
      this.r = r;
      this.g = g;
      this.b = b;
      this.a = a;
    }
  
    toRgba(r, g, b, a) {
      return `rgba(${r ? r : this.r}, ${g ? g: this.g}, ${b ? b : this.b}, ${a ? a : this.a})`;
    }
  }