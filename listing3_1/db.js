// 代码中的例子是使用sqlite3而不是SQLite
// 并且注意sqlite3支持的版本
// The sqlite3 module works with:

// Node.js v11.x, v12.x, v13.x and v14.x.
// Electron v6.0.x, v6.1.x, v7.0.x, v7.1.x, v8.0.x, v8.1.x and v8.2.x
// 注 这里使用node 版本11.2并没有安装成功 将版本升到15.4.0才成功安装

// SQLite3是单机数据库。功能简约bai，小型化，追求最大磁盘效率 不能用于网络，一般用于制作桌面单机小程序；不需要在系统中配置，直接可以使用；SQLite 引擎不是一个独立的进程，可以按应用程序需求进行静态或动态连接。SQLite 直接访问其存储文件。
// MYsql是完善的服务器数据库。功能全面，综合化，追求最大并发效率 多用于网页制作。
const sqlite3 = require('sqlite3').verbose();
const dbName = 'later.sqlite';
// 连接到一个数据库文件
const db = new sqlite3.Database(dbName);

db.serialize(() => {
  // 如果还没有，创建一个article表
  const sql = `
  CREATE TABLE IF NOT EXISTS articles
  (id integer primary key, title, content TEXT)
  `;
  db.run(sql);
})

class Article{
  // 获取所有文章
  static all(cb) {
    db.all('SELECT * FROM articles', cb);
  }

  // 选择一篇指定文章
  static find(id, cb) {
    db.get('SELECT * FROM articles WHERE id=?', id, cb);
  }

  static create(data, cb) {
    // 问号表示参数
    const sql = 'INSERT INTO articles(title,content) VALUES(?, ?)';
    db.run(sql, data.title, data.content, cb);
  }

  static delete(id, cb) {
    if (!id) {
      return cb(new Error('Please provide an id'));
    }
    db.run('DELETE FROM articles WHERE id=?', id, cb);
  }
}

module.exports = db;
module.exports.Article = Article;