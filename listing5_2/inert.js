const hapi = require('hapi');
const Inert = require('inert');

const server = new hapi.Server({
  host: 'localhost',
  port: 8000,
});
// v17 升级以后
// server.register(Inert, () => { });

// server.route({
//   method: 'GET',
//   path: '/{param*}',
//   handler: {
//     directory: {
//       path: '.',
//       redirectToSlash: true,
//       index: true,
//     }
//   }
// });

// server.start((err) => {
//   if (err) {
//     throw err;
//   }
//   console.log('Server running at: ', server.info.uri);
// });
const provision = async () => {

  await server.register(Inert);

  server.route({
      method: 'GET',
      path: '/{param*}',
      handler: {
          directory: {
              path: '.',
              redirectToSlash: true,
              index: true,
          }
      }
  });

  await server.start();

  console.log('Server running at:', server.info.uri);
};

provision();