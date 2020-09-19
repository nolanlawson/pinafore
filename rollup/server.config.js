import config from 'sapper/config/rollup.js'
import pkg from '../package.json'
import replace from '@rollup/plugin-replace'
import svelte from 'rollup-plugin-svelte'
import cjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import alias from '@rollup/plugin-alias'
import { dev, inlineSvgs, allSvgs } from './shared.config.js'

// modules that the server should ignore, either because they cause errors or warnings
// (because they're only used on the client side)
const NOOP_MODULES = [
  '../_workers/blurhash',
  'tesseract.js/dist/worker.min.js',
  'tesseract.js/dist/worker.min.js.map',
  'tesseract.js-core/tesseract-core.wasm',
  'tesseract.js-core/tesseract-core.wasm.js',
  'tesseract.js',
  'file-drop-element'
]

export default {
  input: config.client.input(),
  output: config.server.output(),
  external: Object.keys(pkg.dependencies),
  plugins: [
    replace({
      'process.env.INLINE_SVGS': JSON.stringify(inlineSvgs),
      'process.env.ALL_SVGS': JSON.stringify(allSvgs)
    }),
    alias({ entries: NOOP_MODULES.map(find => ({ find, replacement: 'lodash/noop' })) }),
    svelte({
      css: false,
      store: true,
      generate: 'ssr',
      dev
    }),
    resolve(),
    cjs(),
    json()
  ]
}
