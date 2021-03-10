const koa=require('koa');
const app = koa();

// 在中间件函数上使用生成器语法，用生成器在两个中间件的上下文中切换
app.use(function* (next) {
  const start = new Date;
  // yield以运行下一个中间件组件，yield将执行步骤转到中间件到栈中去，然后在在一个中间件返回后在回来
  yield next;
  const ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});

app.use(function* () {
  // this.body相当于express总到res.send(response)
  this.body = 'hello world';
});

app.listen(3000);