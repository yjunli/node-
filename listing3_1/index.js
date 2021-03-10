const express = require('express');
const bodyParser = require('body-parser');
const read = require('node-readability');

// 用express()创建以程序实例
const app = express();

const Article = require('./db').Article;

//支持编码为JSON的请求消息体
app.use(bodyParser.json());
// 支持编码为表单的请求消息体
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', process.env.PORT || 3000);

// 获取所有文章
// curl http://localhost:3000/articles
app.get('/articles', (req, res, next) => {
  Article.all((err, articles) => {
    if (err) {
      return next(err);
    }
    res.format({
      html: () => {
        res.render('articles.ejs', { articles: articles });
      },
      json: () => {
        res.send(articles)
      }
    })
  });
});

// 创建一篇文章
// 命令参考 curl --data "url=http://manning.com/cantelon2/" http://localhost:3000/articles
app.post('/articles', (req, res, next) => {
  // 从post消息体中得到URL
  const url = req.body.url;
  // 用readability模块获取URL指向的页面
  read(url, (err, result) => {
    if (err || !result) {
      // 如果有错误 将错误交给express的中间栈处理
      res.status(500).send('Error downloading articles');
    }
    Article.create({ title: result.title, content: result.content },
      (err, article) => {
        if (err) {
          return next(err);
        }
        // 文章保存成功后，发送状态码为200到响应
        res.send('OK');
    });
  });
});

// 获取指定文章
app.get('/articles/:id', (req, res, next) => {
  const id = req.params.id;
  Article.find(id, (err, article) => {
    if (err) {
      return next(err);
    }
    res.send(article);
  });
});

// 删除指定文章
// curl -X DELETE  http://localhost:3000/articles/0
app.delete('/articles/:id', (req, res, next) => {
  const id = req.params.id;
  Article.delete(id, (err) => {
    if (err) {
      return next(err);
    }
    res.send({ message: 'Delete' });
  });
});

// 将这个程序实例绑定在一个TCP端口上
app.listen(app.get('port'), () => {
  console.log('App started on port', app.get('port'));
})

module.exports = app;