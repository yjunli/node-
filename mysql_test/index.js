const app = require('./createApplication.js');
const db = require('./connection.js');

const express = app();

express.get('/get', function(req, res) {
  // 查询实例
  db.query('select * from t_user', [], function(result, fields) {
    res.send('get Success', req, res, result);
  });
});

express.post('/post', function(req, res) {
  db.query('INSERT INTO t_user(username, pass) VALUES(?, ?)', ['whg', '123'], (err, results) => {
    if (err) {
      console.log(err);
    }
    res.send('post success', req, res, results);
  });
});

express.listen(3000);
