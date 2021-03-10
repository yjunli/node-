const read = require('node-readability');

const url = 'http://www.manning.com/cantelon2/';

read(url, (err, result) => {
  if (err) {
    console.log('err :>> ', err);
    return;
  }
  console.log('err, result :>> ', result);
})