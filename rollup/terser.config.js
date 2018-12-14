import { terser } from 'rollup-plugin-terser'

export default () => terser({
  module: true,
  sourcemap: true,
  cache: true,
  parallel: true,
  sourceMap: true,
  terserOptions: {
    ecma: 6,
    mangle: true,
    compress: {
      pure_funcs: ['console.log']
    },
    output: {
      comments: false
    },
    safari10: true
  }
})
