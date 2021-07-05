import resolve from '@rollup/plugin-node-resolve'

// Moved Rollup into _thirdparty to avoid issues with "type": "module"
// Build with:
// yarn add @rollup/plugin-node-resolve lodash-es
// npx rollup -c ./src/routes/_thirdparty/lodash/rollup.config.js
// yarn remove @rollup/plugin-node-resolve lodash-es

function createConfig (file) {
  const input = `./src/routes/_thirdparty/lodash/${file}`
  return {
    input,
    output: {
      file: input.replace('.src.js', '.js'),
      format: 'esm'
    },
    plugins: [
      resolve(),
      {
        name: 'add-header',
        transform (code) {
          return '/* eslint-disable */\n' + code
        }
      }
    ]
  }
}

export default [
  createConfig('timers.src.js'),
  createConfig('objects.src.js')
]
