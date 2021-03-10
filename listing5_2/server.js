const hapi = require('hapi');
const server = new hapi.Server({
  host: 'localhost',
  port: 8000,
});

// 书中事例 版本 代码
// According to hapi v17.0.0 they Removed support for multiple connections for a single server
// 因而 只需要用如上的方法来创建即可
// const server = new hapi.Server();

// server.connection({
//   host: 'localhost',
//   port: 8000,
// });

server.start((err) => {
  if (err) {
    throw err;
  }
  console.log('Server running at: ', server.info.uri);
});

server.route({
  method: 'GET',
  path: '/hello',
  handler: (request, reply) => {
    // v17 升级后直接return即可
    // return reply('hello world');
    return 'hello world'
  }
});
