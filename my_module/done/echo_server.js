const net = require('net');
// 只要客户端连接上来 就会创建一个socket
// socket是一个事件发射器
const server = net.createServer((socket) => {
  // 只要socket上有新数据过来 就会发出些data事件
  socket.on('data', data => {
    socket.write(`${data}===>more`);
  })
  // 响应只应该发生一次的事件
  socket.once('data', data => {
    socket.write(`${data}===>once`);
  })
});

server.listen(8888);