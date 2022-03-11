const { Server } = require('net');

const server = new Server();

server.on("conection", (socket) => {
  console.log('New conection from', socket.remoteAddress);
});

server.listen({ port: 3500, host: '0.0.0.0' }, () => {
  console.log('listening on port 3500')
});