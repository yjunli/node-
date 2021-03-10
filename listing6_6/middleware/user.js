// node 是单线程的 没有线程本地存储
// 对于http服务器而言 请求和响应变量是唯一的上下文对象
// 构建在node之上的高层架构可能会提供额外的对象存放已认证用户之类的数据
// 但是express坚持使用node提供的原始对象
const User = require('../models/user');
module.exports = (req, res, next) => {// 从会话中取出已登陆用户的ID
  if (req.remoteUser) {
    res.local.user = req.remoteUser;
  }
  const uid = req.session.uid;
  if (!uid) {
    return next();
  }
  User.get(uid, (err, user) => {
    // 从redis中取出已登陆用户的数据
    if (err) {
      return next(err);
    }
    // 将用户数据输出到响应对象中
    req.user = res.locals.user = user;
    next();
  })
}