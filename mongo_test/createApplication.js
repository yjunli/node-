const http = require('http');
const url = require('url');
const util = require("util");

function createApplication() {
  function app(req, res) {
    // 设置允许跨域
    res.setHeader('Access-Control-Allow-Origin', '*');
    // 响应方法
    res.send = function(params) {
      // 设置响应头
      res.setHeader('Content-Type', 'text/plain;charset=utf8');

      // 检测传入值得数据类型
      switch (typeof params) {
        case 'object':
          res.setHeader('Content-Type', 'application/json;charset=utf8');
          params = util.inspect(params); // 将任意类型的对象转换成字符串
          break;
        case 'number':
        default:
          break;
      }

      // 响应
      res.end(params);
    };

    // 响应文件方法
    res.sendFile = function(pathname) {
      fs.createReadStream(pathname).pipe(res);
    };
    app.handle(req, res);
  }

  app.routes = []; // 路由容器
  app.get = function(path, handle) {
    // 注册get方法的路由
    app.routes.push({
      // 路由表
      path,
      handle,
      method: 'get',
    });
  };
  app.post = function(path, handle) {
    app.routes.push({
      path,
      handle,
      method: 'post',
    });
  };

  app.listen = function() {
    // 创建http服务器
    const server = http.createServer(app);
    server.listen(...arguments);
  };

  app.handle = function(req, res) {
    // 路由处理
    const { pathname } = url.parse(req.url); // 获取请求路径
    let ids = 0;
    const routes = this.routes; // 获取路由表
    function next() {
      // next控制路由进入下一匹配
      if (ids >= routes.length) {
        return res.end(`Cannot ${req.method} ${pathname}`);
      }

      const { path, method, handle } = routes[ids++];
      // 进行路由匹配
      if ((pathname === path || pathname === '*') && method === req.method.toLowerCase()) {
        return handle(req, res);
      }
      // 如果不匹配 则去下一个路由匹配
      next();
    }
    next();
  };

  return app;
}

module.exports = createApplication;
