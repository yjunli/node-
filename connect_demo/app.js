const app = require('connect')();

app.use((req, res, next) => {
  console.log('res :>> ', res);
  console.log('res :>> ', res);
  console.log('next :>> ', next);
  res.end('hello world!');
})

app.listen(3000);