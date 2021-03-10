const events = require('events');
const net = require('net');
const channel = new events.EventEmitter();

channel.clients = {};
channel.subscriptions = {};

// 设置最多监听的数量
channel.setMaxListeners(50);

channel.on('join', function (id, client) {
  this.clients[id] = client;
  this.subscriptions[id] = (senderId, message) => {
    console.log('senderId :>> ', senderId);
    // 忽略发出这一广播数据的用户
    if (id !== senderId) {
      this.clients[id].write(message);
    }
  };
  const welcome = `Welcome!
  Guests online: ${this.listeners('broadcast').length}
  `
  client.write(`${welcome}\n`);
  this.on('broadcast', this.subscriptions[id]);
});

// 添加leave监听事件
channel.on('leave', function (id) {
  channel.removeListener('broadcast', this.subscriptions[id]);
  channel.emit('broadcast',id,`${id} has left the chatroom.\n`)
})

// 停止聊天服务命令监听
channel.on('shutdown', function () {
  channel.emit('broadcast', '', 'the server has shut down.\n');
  channel.removeAllListeners('broadcast');
})

const server = net.createServer((client) => {
  const id = `${client.remoteAddress}:${client.remotePort}`;
  console.log('id :>> ', id);
  channel.emit('join', id, client);
  client.on('data', (data) => {
    data = data.toString();
    if (data === 'shutdown\r\n') {
      channel.emit('shutdown')
    }
    channel.emit('broadcast', id, data);
  })

  // 添加离开监听事件
  client.on('close', () => {
    channel.emit('leave', id);
  })
})

server.listen(8888);