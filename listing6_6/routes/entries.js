const Entry = require("../models/entry");

exports.form = (req, res) => {
  console.log('res.locals :>> ', res.locals);
  res.render('post', { title: 'Post' });
};

exports.submit = (req, res, next) => {
  const user = res.locals.user;
  const username = user ? user.name : null;
  const entry = new Entry({
    username: username,
    title: req.body.title,
    body: req.body.body,
  });
  entry.save((err) => {
    if (err) {
      return next(err);
    }
    if (req.remoteUser) {
      res.json({message:'Entry added.'})
    } else {
      res.redirect('/');
    }
  })
};

exports.list = (req, res, next) => {
  // 获取消息
  Entry.getRange(0, -1, (err, entries) => {
    if (err) {
      return next(err);
    }
    // 渲染http响应
    res.render('entries', {
      title: 'Entries',
      entries: entries
    });
  })
}
