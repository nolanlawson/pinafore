const config = (process.browser || process.env.IS_WEBPACK)
  ? process.env.CONFIG_JSON
  : require('./config.node.js')
export default config
