// This is the sanitized version of the config JSON we will pass to the client.
// We don't want to expose too much information here. We don't need
// client-side JavaScript to know what port we're running on, for instance.

const configJson = require('./config.node.js')
const CLIENT_SAFE_CONFIG_KEYS = [
  'defaultLightTheme',
  'defaultDarkTheme',
  'appName',
  'appUrl'
]

function pick (obj, keys) {
  let res = {}
  for (let key of keys) {
    res[key] = obj[key]
  }
  return res
}

module.exports = pick(
  configJson,
  CLIENT_SAFE_CONFIG_KEYS
)
