const fs = require('fs');
const tasks = [];
const wordCounts = {};
const fileDir = './root';

let completedTasks = 0;

function checkIfComplete() {
  completedTasks++;
  if (completedTasks === tasks.length) {
    for (let index in wordCounts) {
      console.log(`${index}: ${wordCounts[index]}`);
    }
  }
}

function addWordCount(word) {
  wordCounts[word] = (wordCounts[word]) ? wordCounts[word] + 1 : 1;
}

function countWordsInText(text) {
  const words = text.toString().toLowerCase().split(/\W+/).sort();
  // 注：foreach与map区别：foreach改变原数组且返回值为undefined；map不改变原数组返回新的数组
  words.filter(word => word).forEach(word => addWordCount(word));

}

// readdir API读取目录 而非文件
fs.readdir(fileDir, (err, files) => {
  if (err) {
    throw err;
  }
  files.forEach((file) => {
    const task = ((file) => {
      return () => {
        fs.readFile(file, (error, text) => {
          if (error) {
            throw error;
          }
          countWordsInText(text);
          checkIfComplete();
        })
      }
    })(`${fileDir}/${file}`);
    tasks.push(task);
  })
  tasks.forEach(task => task());
})