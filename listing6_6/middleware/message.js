const express=require('express');

function message(req){
  return(msg, types)=>{
    type=types||'info';
    let sess=req.session;
    sess.message=sess.message||[];
    sess.message.push({ type, string: msg });
  }
}

// 扩展了响应的原型
module.exports = (req, res, next) => {
  res.message = message(req);
  // res.error 函数可以将类型为error对消息添加到消息队列中
  res.error = (msg) => {
    return res.message(msg, 'error');
  };
  // 把这些消息输出到模版中展示
  // 一种做法：将res.session.message传到每个res.render()中调用 很繁琐
  // 或参考如下代码
  res.locals.message = req.session.message || []; // 更高效到把消息输出到所有要渲染的模版上
  res.locals.removeMessage = () => {
    req.session.message = [];
  };
  next();
}