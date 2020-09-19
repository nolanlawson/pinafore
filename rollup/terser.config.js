import { terser } from 'rollup-plugin-terser'
import terserOptions from '../bin/terserOptions'

export default () => terser({
  exclude: /(tesseract-asset|page-lifecycle)/, // tesseract causes problems, page-lifecycle is pre-minified
  cache: !process.env.TERSER_DISABLE_CACHE,
  parallel: true,
  sourceMap: true,
  terserOptions
})
