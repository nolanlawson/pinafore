import json from '@rollup/plugin-json'
import nodeResolve from '@rollup/plugin-node-resolve'

// We have to build this as webpack.config.cjs so that Sapper can require() it correctly,
// since Sapper is designed to only work with CommonJS

const createConfig = (input) => {
  return {
    input,
    plugins: [
      nodeResolve(),
      json()
    ],
    output: {
      file: input.replace('.js', '.cjs'),
      format: 'cjs',
      exports: 'auto'
    },
    external: [
      'cheerio',
      'circular-dependency-plugin',
      'format-message-parse',
      'fs',
      'path',
      'sapper/config/webpack.js',
      'terser-webpack-plugin',
      'webpack',
      'webpack-bundle-analyzer'
    ]
  }
}

export default [
  createConfig('./webpack/webpack.config.js'),
  createConfig('./webpack/svelte-intl-loader.js')
]
