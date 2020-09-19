import config from 'sapper/config/rollup.js'
import terser from './terser.config.js'
import replace from '@rollup/plugin-replace'
import cjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import { mode, dev } from './shared.config.js'

export default {
  input: config.serviceworker.input(),
  output: config.serviceworker.output(),
  plugins: [
    replace({
      'process.browser': true,
      'process.env.NODE_ENV': JSON.stringify(mode),
      'process.env.SAPPER_TIMESTAMP': process.env.SAPPER_TIMESTAMP || Date.now()
    }),
    resolve(),
    cjs(),
    json(),
    !dev && terser()
  ]
}
