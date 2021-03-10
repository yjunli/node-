const redis = require('redis');
const db = redis.createClient({
  retry_strategy: () => 1000
});// 创建redis客户端实例
// redis.createClient()创建报错解决办法
// https://github.com/NodeRedis/node-redis/issues/1420

class Entry{
  constructor(obj) {
    for (let key in obj) {
      this[key]=obj[key]
    }
  }

  static getRange(form, to, cb) {
    db.lrange('entries', form, to, (err, items) => {
      if (err) {
        return cb(err);
      }
      let entries = [];
      items.forEach((item) => {
        entries.push(JSON.parse(item));
      });
      cb(null, entries);
    })
  }
  save(cb) {
    const entryJSON = JSON.stringify(this);
    db.lpush('entries', entryJSON, (err) => {
      if (err) {
        return cb(err);
      }
      cb();
    })
  }
}

module.exports = Entry;