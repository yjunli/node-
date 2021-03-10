const connect = require('connect')();

const env = process.env.NODE_ENV || 'development';

function errorHandler(err, req, res, next) {
  res.statusCode = 500;
  switch (env) {
    case 'development':
      console.log('ERROR:', err);
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(err));
      break;
    default:
      res.end('Server error');
  }
}
// 可以用不同的配置调用多次
function setup(format) {
  const regexp = /:(\w+)/g;

  // connect使用的这是logger 组件
  return function createLogger(req, res, next) {
    // 用正则表达式格式化请求的日志条目
    const str = format.replace(regexp, (match, property) => {
      return req[property];
    });
    console.log(str);
    next();
  }
}

connect
  .use(setup(':cvvfbgf'))
  .use(setup(':jsbchjbhdsjcbhd')) // 跳过
  .use(setup(':xmklsnjkdnvjk222')) // 跳过
  .use(errorHandler)
  .listen(3000);
