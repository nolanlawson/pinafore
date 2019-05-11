// This code should only run in Node.js, never in Webpack.

const fs = require('fs')
const path = require('path')
const defaultConfig = require('./config.defaults.json')
const configFilePath = path.join(__dirname, '../../config.json')
const config = fs.existsSync(configFilePath)
  ? JSON.parse(fs.readFileSync(configFilePath, 'utf8'))
  : {}

module.exports = Object.assign({}, defaultConfig, config)
