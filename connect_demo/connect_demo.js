const connect = require('connect')();

function logger(req, res, next) {
  console.log('%s %s', req.method, req.url);
  next();
}

function hello(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.end('hello world');
  // 作为最后一个中间件 不再需要调用next函数，已结束
}
// 二选一 都可以
// connect.use(logger).use(hello).listen(3000);

// 二选一 都可以
connect.use(logger);
connect.use(hello);
connect.listen(3000);
