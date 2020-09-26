const fs = require('fs')
const p = new Promise(function (resolve, reject) {
  fs.readFile('a.txt','utf-8', (err, data) => {
    if (err) {
      reject(err)
    } else {
      resolve(data)
    }
  })
})
p.then(data => {
  console.log(data)
}).catch(err => {
  console.log('失败了')
  console.log(err)
})