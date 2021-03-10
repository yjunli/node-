const app = require('./createApplication.js');
const { insertOne, count } = require('./app.js');

const express = app();

express.get('/get', function(req, res) {
  count({}, function(result) {
    res.send('get Success', req, res, result);
  });
});

express.post('/post', function(req, res) {
  insertOne({}, (err, results) => {
    if (err) {
      console.log(err);
    }
    res.send('post success', req, res, results);
  });
});

express.listen(3000);
