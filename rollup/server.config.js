import resolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import commonjs from 'rollup-plugin-commonjs'
import svelte from 'rollup-plugin-svelte'
import config from 'sapper/config/rollup.js'
import pkg from '../package.json'

const dev = process.env.NODE_ENV === 'development'

export default {
  input: config.server.input(),
  output: config.server.output(),
  plugins: [
    replace({
      'process.browser': false,
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    svelte({
      generate: 'ssr',
      store: true,
      dev
    }),
    resolve(),
    commonjs()
  ],
  external: Object.keys(pkg.dependencies).concat(
    require('module').builtinModules || Object.keys(process.binding('natives'))
  ),

  // temporary, pending Rollup 1.0
  experimentalCodeSplitting: true
}
