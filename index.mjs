import { createReadStream } from 'node:fs';
import { createServer } from 'node:http';
import { WebSocket, WebSocketServer } from 'ws';

const httpServer = createServer();
httpServer.on('request', (req, res) => {
  if (req.url.includes('favicon.ico')) {
    res.writeHead(204, { 'Content-Type': 'text/plain' });
    res.end('No Content');
  } else {
    const index = createReadStream('index.html');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    index.pipe(res); //no need to call end() - https://stackoverflow.com/questions/27509711/node-http-res-end
  }
  console.log(`request received from ${Object.values(req.url)}`);
});

const wss = new WebSocketServer({ noServer: true });

//http handler
const onSocketPreError = (error) => {
  console.log(error);
};
//websocket handler
const onSocketPostError = (error) => {
  console.log(error);
};

httpServer.on('upgrade', (req, socket, head) => {
  socket.on('error', onSocketPreError);

  //perform auth
  if (!!req.headers['BadAuth']) {
    socket.write('HTTP/1.1 401 Unauthorized zzzzzzzzzzzz\r\n\r\n');
    socket.destroy();
    return;
  }

  wss.handleUpgrade(req, socket, head, (ws) => {
    socket.removeListener('error', onSocketPreError);
    wss.emit('connection', ws, req);
  });
});

wss.on('connection', (ws, req) => {
  console.log(`Client connected`);

  ws.on('error', onSocketPostError);
  ws.on('message', (msg, isBinary) => {
    wss.clients.forEach((client) => {
      console.log('received %s', msg);
      if (client.readyState === WebSocket.OPEN) {
        client.send(msg, { binary: isBinary });
      }
    });
  });
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

httpServer.listen(8080, () => {
  console.log('Http server listening on port 8080');
});
