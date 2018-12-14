import resolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import commonjs from 'rollup-plugin-commonjs'
import svelte from 'rollup-plugin-svelte'
import config from 'sapper/config/rollup.js'
import terser from './terser.config'

const dev = process.env.NODE_ENV === 'development'

export default {
  input: config.client.input(),
  output: config.client.output(),
  plugins: [
    replace({
      'process.browser': true,
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    svelte({
      dev,
      hydratable: true,
      emitCss: true,
      store: true
    }),
    resolve(),
    commonjs(),

    !dev && terser()
  ],

  // temporary, pending Rollup 1.0
  experimentalCodeSplitting: true
}
