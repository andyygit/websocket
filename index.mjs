import { createServer } from 'node:http';
import { WebSocketServer } from 'ws';

const httpServer = createServer();
httpServer.on('request', (req, res) => {
  if (req.url.includes('favicon.ico')) {
    res.writeHead(204, { 'Content-Type': 'text/plain' });
    res.end('No Content');
  } else {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        data: 'Hello world!zzz',
      })
    );
  }
  console.log(`request received from ${Object.values(req.url)}`);
});

// const wsServer = new WebSocketServer();

httpServer.listen(8080, () => {
  console.log('Http server listening on port 8080');
});

// const wss = new WebSocketServer({ port: 8080 });

// wss.on('connection', (ws) => {
//   console.log('Client connected');

//   ws.on('message', (data) => {
//     console.log('received %s', data);
//     ws.send(`${data}`);
//   });
//   ws.on('close', () => {
//     console.log('Client disconnected');
//   });
//   ws.on('error', console.error);
// });
