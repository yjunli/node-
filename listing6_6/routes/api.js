const auth = require('basic-auth');
const express = require('express');
const User = require('../models/user');
const Entry = require('../models/entry');

exports.auth = (req, res, next) => {
  console.log('req', req, auth(req));
  const { name, pass } = auth(req);
  User.authenticate(name, pass, (err, user) => {
    if (user) {
      req.remoteUser = user;
    }
    next(err);
  })
}

exports.user = (req, res, next) => {
  User.get(req.params.id, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user.id) {
      return res.sendStatus(404);
    }
    res.json(user);
  })
};

exports.entries = (req, res, next) => {
  const page = req.page;
  Entry.getRange(page.from, page.to, (err, entries) => {
    if (err) {
      return next(err);
    }
    // res.json(entries);
    // 改为内容协商
    res.format({
      'application/json': () => {
        res.send(entries);
      },
      // xml的返回可以被简化 参考view/entries/xml.ejs
      'application/xml': () => {
        // res.write('<entries>\n');
        // entries.forEach((entry) => {
        //   res.write(```
        //     <entry>
        //       <title>${entry.title}</title>
        //       <body>${entry.body}</body>
        //       <uername>${entry.uername}</uername>
        //     </entry>
        //   ```);
        // });
        // res.end('</entries>')
        res.render('entries/xml', { entries });
      }
    })
  })
}