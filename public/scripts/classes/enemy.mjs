import replaceIfUndefined from '../lib/replaceIfUndefined';

class Enemy {
  constructor(props) {
    this.update(props);
    this.pos = props.pos;
  }

  update(props) {
    this.type = replaceIfUndefined(props.type, this.type ?? 'normal');
    this.rpos = replaceIfUndefined(props.pos, this.rpos ?? [0, 0]);
    this.radius = replaceIfUndefined(props.radius, this.radius ?? 15);
  }
}

export 