import resolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import commonjs from 'rollup-plugin-commonjs'
import config from 'sapper/config/rollup.js'
import terser from './terser.config'

const dev = process.env.NODE_ENV === 'development'

export default {
  input: config.serviceworker.input(),
  output: config.serviceworker.output(),
  plugins: [
    resolve(),
    replace({
      'process.browser': true,
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.SAPPER_TIMESTAMP': process.env.SAPPER_TIMESTAMP || Date.now()
    }),
    commonjs(),
    !dev && terser()
  ]
}
