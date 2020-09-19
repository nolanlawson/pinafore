import config from 'sapper/config/rollup.js'
import terser from './terser.config.js'
import replace from '@rollup/plugin-replace'
import svelte from 'rollup-plugin-svelte'
import cjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import { dev, mode, inlineSvgs, allSvgs } from './shared.config.js'

import urlRegex from '../src/routes/_utils/urlRegexSource.js'

export default {
  input: config.client.input(),
  output: config.client.output(),
  plugins: [
    replace({
      'process.browser': true,
      'process.env.NODE_ENV': JSON.stringify(mode),
      'process.env.INLINE_SVGS': JSON.stringify(inlineSvgs),
      'process.env.ALL_SVGS': JSON.stringify(allSvgs),
      'process.env.URL_REGEX': urlRegex().toString()
    }),
    svelte({
      dev,
      hydratable: true,
      store: true,
      hotReload: dev
    }),
    resolve(),
    cjs(),
    json(),
    !dev && terser()
  ]
}
