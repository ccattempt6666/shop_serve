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

read('a.txt').then(res => {
  console.log(res)
  return read('b.txt')
}).then(res => {
  console.log(res)
  return read('c.txt')
}).then(res => {
  console.log(res)
}).catch(e => {
  console.log(e)
})