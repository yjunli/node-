// 在 4.x 版本中，Express 已经不再依赖 Connect
// 除了 express.static，Express 以前包括的中间件现在已经在一个单独的库里
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var methodOverride = require('method-override');
const bodyParser = require('body-parser');

const entries = require('./routes/entries');
const register = require('./routes/register');
const login = require('./routes/login');
const api = require('./routes/api');
const Entry = require('./models/entry');

const page = require('./middleware/page');
const post = require('./middleware/post');
const user = require('./middleware/user');
const message = require('./middleware/message');
const session=require('express-session');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Most middleware (like methodOverride) is no longer bundled with Express and must be installed separately.
// Please see https://github.com/senchalabs/connect#middleware.
app.use(methodOverride());
app.use(cookieParser());
app.use(session({
  secret:'secret',
  resave:false,
  saveUninitialized:true,
}))
app.use(express.static(path.join(__dirname, 'public')));
app.use(user);
app.use(message);
// app.router is deprecated!\nPlease see the 3.x to 4.x migration guide for details on how to update your app.
// https://stackoverflow.com/questions/32565167/app-router-is-deprecated-on-simple-website
// app.use(app.router);

// 原文中要求相关配置 在Express4.10 bodyParser 配置已经取消
// 参见https://stackoverflow.com/questions/27320191/express4-10-bodyparser-req-body-undefined
// bodyParser作用：将表单对象组装仅req.body。如user[name]转换成 req.body.user.name
app.use(bodyParser.urlencoded({ extended: true }));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/api', api.auth);

// 注意位置 因为下面有使用app.use('/',function(){})
// app.use('/',function(){}) 表示请求该路径的任何请求 无论get/post等 都需要执行这个函数
// app.use(function(){}) 表示请求 都需要执行这个函数
app.get('/', entries.list);
// 注意位置 放在尾部未能生效 头部相关配置未能注入
app.get('/get', entries.form);
app.post('/post', post.requireEntryTitle, post.requireEntryTitleLengthAbove(4),entries.submit);
app.get('/register', register.form);
app.post('/register', register.submit);
app.get('/login', login.form);
app.post('/login', login.submit);
app.get('/logout', login.logout);
app.get('/api/user/:id', api.user);
app.get('/api/entries/:page?', page(Entry.count), api.entries);
app.post('/api/entry', entries.submit);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
