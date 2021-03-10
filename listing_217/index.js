const fs = require('fs');
const request = require('request');
const htmlparser = require('htmlparser');


const configFilename = './ree_feeds.txt';

// 注：本书使用的fs.exists是不推荐使用的 并且在10.17. 版本将要废弃建议使用fs.open()和fs.access代替 并且在需要进行fs.readFile、fs.open 和fs.writeFile()之前不需要通过fs.access检查文件是否存在 直接使用 然后抛出错误即可，本例中使用可以当作了解API用法
function checkForRSSFile() {
  fs.access(configFilename, (err) => {
    if (err) {
      return next(new Error(`Missing RSS file: ${configFilename}`));
    }
    next(null, configFilename);
  })
}

function readRSSFile(configFilename) {
  fs.readFile(configFilename, (err, feedList) => {
    if (err) {
      return next(err);
    }
    feedList = feedList.toString().replace(/^\s+|\s+$/g, '').split('\n');
    const random = Math.floor(Math.random() * feedList.length);
    next(null, feedList[random]);
  });
}

function downloadRSSFeed(feedUrl) {
  request({ url: feedUrl }, (err, res, body) => {
    if (err) {
      return next(err);
    }
    if (res.statusCode !== 200) {
      return next(new Error('Abnormal response status code'));
    }
    next(null, body);
  })
}

function parseRSSFeed(rss) {
  const handler = new htmlparser.RssHandler();
  const parser = new htmlparser.Parser(handler);
  parser.parseComplete(rss);
  if (!handler.dom.items.length) {
    return next(new Error('No RSS items found'));
  }
  const item = handler.dom.items.shift();
  console.log(item.title);
  console.log(item.link);
}

const tasks = [checkForRSSFile, readRSSFile, downloadRSSFeed, parseRSSFeed];

function next(err, result) {
  if (err) {
    throw err;
  }
  const currentTask = tasks.shift();
  if (currentTask) {
    currentTask(result);
  }
}

next();