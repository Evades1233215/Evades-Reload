import replaceIfUndefined from '../lib/replaceIfUndefined';

class Player {
  constructor(props) {
    this.name = props.name;
    this.id = props.id;
    this.pos = props.pos;
    this.update(props);
  }

  update(props) {
    this.hero = replaceIfUndefined(props.hero, this.hero ?? 'Magmax');
    this.rpos = replaceIfUndefined(props.pos, this.rpos ?? [15, 2 * 32 + 15]);
    this.vel = replaceIfUndefined(props.vel, this.vel ?? [0, 0]);
    this.radius = replaceIfUndefined(props.radius, this.radius ?? 15);
    this.speed = replaceIfUndefined(props.speed, this.speed ?? 5);
    this.energy = replaceIfUndefined(props.energy, this.energy ?? 30);
    this.maxEnergy = replaceIfUndefined(props.maxEnergy, this.maxEnergy ?? 30);
    this.regen = replaceIfUndefined(props.regen, this.regen ?? 1);
    this.downed = replaceIfUndefined(props.downed, this.downed ?? false);
    this.world = replaceIfUndefined(props.world, this.world ?? '');
    this.area = replaceIfUndefined(props.area, this.area ?? 0);
  }
}

export default Player;
