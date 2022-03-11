const { Socket } = require('net');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
})
const socket = new Socket();

const END = 'END';

socket.connect({ host: '127.0.0.1', port: 3000 });
socket.setEncoding('utf-8');

readline.on('line', (message) => {
  socket.write(message);
  if (message === END) {
    socket.end();
  }
})
socket.on("close", () => process.exit(0));

socket.on("data", (data) => {
  console.log(`Tomi: ${data}`);
});
