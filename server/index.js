import WebSocket from 'ws';

const wss = new WebSocket.Server({
  port: 8000,
});

wss.broadcast = function broadcastClients(payload) {
  wss.clients.forEach((client) => client.send(payload));
}

wss.on('connection', (ws) => {
  console.log('server connection');

  // receive message
  ws.on('message', function incoming(payload) {
    wss.broadcast(payload);
  });
});
