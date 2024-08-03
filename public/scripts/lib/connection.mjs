/**
 * Creates connection with server
 * @returns send: (key: string, data: any) => void disc: () => void
 */
function createWebSocketConnection() {
    const ws = new WebSocket(window.location.href.replace('http', 'ws').replace('https', 'ws'));
  
    function send(key, data) {
      if (typeof key === 'object' && typeof data !== 'function')
        ws.send(JSON.stringify({ [key]: data }));
    }
  
    function disc() {
      ws.close(100);
    }
  
    return { send, disc };
  }
  
  export default createWebSocketConnection;
  