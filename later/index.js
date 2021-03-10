const express = require('express');
// 用express()创建以程序实例
const app = express();

const port = process.env.PORT || 3000;

// 添加路由处理
app.get('/', (req, res) => {
  res.send('Hello World');
});

// 将这个程序实例绑定在一个TCP端口上
app.listen(port, () => {
  console.log(`Express web app available at localhost: ${port}`);
})

// express实现路由