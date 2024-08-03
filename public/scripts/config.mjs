const connection = {
    url: window.location.href.replace('http', 'ws').replace('https', 'ws'),
    reconnectRate: 2000,
  };
  
  const resolution = {
    width: 1280,
    height: 720,
  };
  
  const player = {
    radius: 15,
    speed: 7,
    energy: 30,
    maxEnergy: 30,
    regen: 1,
  };
  
  const canvas = {
    bgColor: '#333',
  };
  
  const area = {
    safeZoneWidth: 10 * 32,
    teleportSize: 2 * 32,
  };
  
  export { connection, resolution, player, canvas, area };
  