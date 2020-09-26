const fs = require('fs')
function read (filePath) {
  return new Promise(function (resolve, reject) {
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}
async function fn () {
  try {
    let num = await read('ab.txt')
    console.log(num)
    let num1 = await read('b.txt')
    console.log(num1)
  } catch (e) {
    console.log(e)
  }
}
fn()
console.log(22)