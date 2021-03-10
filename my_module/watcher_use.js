const Watch = require('./WATCHER');
const fs = require('fs');

const watchDir = './unfinished';
const processedDir = './done';

const watch = new Watch(watchDir, processedDir);

// 监听动作 需要有操作
watch.on('process', (file) => {
  const watchFile = `${watchDir}/${file}`;
  const processedFile = `${processedDir}/${file.toLowerCase()}`;
  fs.rename(watchFile, processedFile, (err) => {
    if (err) throw err
  })
})


watch.start();