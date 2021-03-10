// function asyncFunction(callback) {
//   setTimeout(callback, 200);
// }

// let color = 'blue';

// asyncFunction(() => {
//   console.log(`The color is ${color}`);
// })

// color = 'green';
// 结果是The color is green 而不是The color is blue

function asyncFunction(callback) {
  setTimeout(callback, 200);
}

let color = 'blue';

((color) => {
  asyncFunction(() => {
    console.log('the color is', color);
  })
})(color)

color = 'green';