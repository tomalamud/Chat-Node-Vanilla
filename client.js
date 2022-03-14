const { Socket } = require('net');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});
const END = 'END';
const error = (message) => {
  console.error(message);
  process.exit(1);
}

const connect = (host, port) => {
  console.log(`connecting to ${host}:${port}`);
  
  const socket = new Socket();
  socket.connect({ host: '127.0.0.1', port: 3000 });
  socket.setEncoding('utf-8');
  
  socket.on("connect", () => {
    console.log(`connected to ${host}:${port}`);
    
    readline.question("Choose your username: ", (username) => {
      socket.write(username);
      console.log(`Type any message to send it and type ${END} to exit`);
    });

    readline.on('line', (message) => {
      socket.write(message);
      if (message === END) {
        socket.end();
        console.log('Disconnected.')
        process.exit(0);
      }
    });

    socket.on("close", () => process.exit(0));

    socket.on("data", (data) => {
      console.log(`${data}`);
    });
  });

  socket.on("error", (err) => error(err.message));
}

const main = () => {
  if (process.argv.length != 4) {
    error(`node ${__filename} [host] [port]`);
  };
  let [, , host, port] = process.argv;
  if (isNaN(port)) {
    error(`Invalid port ${port}`);
  }
  port = Number(port);
  connect(host, port);
}

if (module === require.main) {
  main();
}