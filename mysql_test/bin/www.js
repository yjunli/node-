const http = require('http');
const querystring = require('querystring');
const multiparty = require('multiparty');

// 设置服务器端口
const PORT = 8000;

// 创建服务器
const server = http.createServer(function (req, res) {
  console.log('req :>> ', req);
  // 获取请求的url
  const url = req.url;
  // 后端设置允许跨域
  res.setHeader("Access-Control-Allow-Origin", "*");

  // 获取请求的method
  const method = req.method;
  // 解析URL，把url中?后面的参数转换为对象
  const query = querystring.parse(url.split('?')[1]);
  const contentType = req.headers['content-type'];

  // 设置返回数据的Content-type为JSON
  res.setHeader('Content-type', 'application/json');

  if (method === 'GET') {
    console.log('==============',this,server);
    // 返回的数据
    const resData = {
      error: 0,
      message: 'GET返回成功',
      data: {
        query,
      },
    };
    // 将对象转换为json字符串
    res.end(JSON.stringify(resData));
    return;
  }
  if (method === 'POST') {
    if (contentType === 'application/json') {
      let postData = '';
      req.on('data', (chunk) => {
        // chunk是原始二进制数据，需要转化成字符串
        postData += chunk;
      });
      req.on('end', () => {
        res.end(postData);
      });
      return;
    }
    if (contentType.indexOf('multipart/form-data') !== -1) {
      const form = new multiparty.Form();
      form.parse(req, (err, fields, files) => {
        res.end(JSON.stringify({ fields, files }));
      });
      return;
    }
  }
  // 如果没有匹配，则返回404页面
  res.writeHead(200, { 'content-type': 'text/plain' });
  res.write('404 Not Found\n');
  res.end();
});

// 设置服务器端口
server.listen(PORT);

console.log(`started at port http://localhost:${PORT}`);
