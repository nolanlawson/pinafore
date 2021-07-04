const fs = require('fs')
const path = require('path')

// Have to use CJS so this file can run in TestCafe. Otherwise it's impossible to get __dirname to work in both envs
const dirname = __dirname

exports.loadMedia = function loadMedia (filename) {
  const filepath = path.join(dirname, 'images', filename)
  if (!fs.existsSync(filepath)) {
    throw new Error('File does not exist: ' + filepath)
  }
  return fs.createReadStream(filepath)
}
