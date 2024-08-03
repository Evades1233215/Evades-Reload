const config = {
    player: {
      radius: 15,
      speed: 17,
      maxSpeed: 17,
      energy: 300,
      maxEnergy: 300,
      spawnMaxEnergy: 300,
      regen: 7,
      maxRegen: 7,
  
      spawn: {
        sx: -(10 * 32 - 15),
        sy: 2 * 32 + 15,
        ex: -15,
        ey: 15 * 32 - 15 - 2 * 32,
        world: 'Misty Moonlight',
        area: 1,
      },
    },
  
    area: {
      safeZoneWidth: 10 * 32,
      teleportLength: 2 * 32,
    },
  
    world: {
      worldList: ['Misty Moonlight', 'Enigmatic Epoch'],
    },
  
    client: {
      heroes: [
        {
          id: 0,
          name: 'Magmax',
          firstColor: '#f00',
          secondColor: '#a00',
        },
      ],
    },
  
    server: {
      tickRate: 1000 / 60,
    },
  };
  
  module.exports = config;
  