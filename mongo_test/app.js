const config = require('./config');
const MongoClient = require('mongodb').MongoClient;

// 用户名:密码@ip/dbName
const dbURL = `mongodb://${config.mongoHost}:27017/${config.dbName}`;

// 连接数据库
function _connect(cb) {
  MongoClient.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true }, (err, server) => {
    if (err) {
      console.log('数据库连接失败');
      throw err;
    }
    const db = server.db(config.dbName);
    cb(db);
  });
}
// 插入一条记录
module.exports.insertOne = function(obj, cb) {
  _connect(function(db) {
    db.collection(config.collectionName).insertOne(obj, function(err, results) {
      cb(err, results);
    });
  });
};

// 根据条件查找记录数
module.exports.count = function(whereObj, cb) {
  _connect(function (db) {
    // TODO: count方法即将废弃
    db.collection(config.collectionName)
      .count(whereObj)
      .then(function(count) {
        cb(count);
      });
  });
};
