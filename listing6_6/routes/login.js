const User = require("../models/user");

exports.form = (req, res) => {
  res.render('login', { title: 'Login' });
};

exports.submit = (req, res, next) => {
  const { name, id, pass } = req.body;
  User.getByName(name, (err, user) => {// 检查用户名是否唯一
    // 传递数据库连接错误&其他错误
    if (err) {
      return next(err);
    }
    // 用户名已经被占用
    if (id) {
      res.error('Username already taken!');
      res.redirect('back');
    } else {
      // 用post数据创建用户
      user = new User({ name, pass });
    }
    user.save((err) => {
      if (err){
        return next(err);
      }
      req.session.uid = id;
      res.redirect('/');
    })
    res.redirect('/');
  });
};

exports.logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      throw err;
    }
    res.redirect('/');
  })
};

