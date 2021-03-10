const User = require("../models/user");

exports.form = (req, res) => {
  res.render('register', { title: 'Register' });
};

exports.submit = (req, res, next) => {
  const { name, pass } = req.body;
  User.authenticate(name,pass, (err, user) => {// 检查凭证
    // 传递数据库连接错误&其他错误
    if (err) {
      return next(err);
    }
    // 处理凭证有效的用户
    if (user) {
      // 为认证存储uid
      req.session.uid = user.id;
      res.redirect('/');
    } else {
      // 输出错误消息
      res.error('Sorry! invaild credentials.');
      // 重定向回到登录表单
      res.redirect('back');
    }
  });
};

