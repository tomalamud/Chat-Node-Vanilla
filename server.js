const { Server } = require('net');
const host = '0.0.0.0';
const END = 'END';
const connections = new Map();
// socket -> username

const error = (message) => {
  console.error(message);
  process.exit(1);
}

const sendMessage = (origin, message) => {
  for (const socket of connections.keys()) {
    if (socket !== origin) {
      socket.write(message);
    };
  };
}

const listen = (port) => {
  const server = new Server();
  server.on("connection", (socket) => {
    const remoteSocket = `${socket.remoteAddress}:${socket.remotePort}`;
    console.log(`New connection from ${remoteSocket}`);
    socket.setEncoding('utf-8');

    socket.on("data", (message) => {
      if (!connections.has(socket)) {
        console.log(`Username: ${message} set for connection [${remoteSocket}]`)
        connections.set(socket, message);
      }
      else if (message === END) {
        console.log(`Connection with ${remoteSocket} closed.`);
        connections.delete(socket);
        socket.end();
      } else {
        // VIEWING USERS
        // for (const username of connections.values()){
        //   console.log(username);
        // }
        const fullMessage = `[${connections.get(socket)}]: ${message}`;
        console.log(`${remoteSocket} -> ${fullMessage}`);
        // enviar mensaje al resto de clientes
        sendMessage(socket, fullMessage);
      }
    })
    socket.on("close", () => console.log(`Connection with ${remoteSocket} closed.`));
  });
  
  server.listen({ port, host }, () => {
    console.log(`listening on port ${port}`);
  });

  server.on("error", (err) => error(err.message));
}

const main = () => {
  if (process.argv.length != 3) {
    error(`node ${__filename} [port]`);
  };
  let port = process.argv[2];
  if (isNaN(port)) {
    error(`Invalid port ${port}`);
  };
  port = Number(port);

  listen(port);
}

if (module === require.main) {
  main();
}