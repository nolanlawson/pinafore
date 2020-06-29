const svgs = require('../bin/svgs')
const fs = require('fs')
const path = require('path')
const $ = require('cheerio')

const inlineSvgs = svgs.filter(_ => _.inline).map(_ => `#${_.id}`)
const allSvgs = {}
const $inlineHtml = $(fs.readFileSync(path.join(__dirname, '../src/template.html'), 'utf8'))
const $externalSvgs = $(fs.readFileSync(path.join(__dirname, '../static/icons.svg'), 'utf8'))
svgs.forEach(_ => {
  const $inlineSvg = $inlineHtml.find(`#${_.id}`)
  const $svg = $inlineSvg.length ? $inlineSvg : $externalSvgs.find(`#${_.id}`)

  allSvgs[`#${_.id}`] = {
    viewBox: $svg.attr('viewBox'),
    html: $svg.html()
  }
})
const mode = process.env.NODE_ENV || 'production'
const dev = mode === 'development'

const resolve = {
  extensions: ['.js', '.json', '.html'],
  mainFields: ['svelte', 'module', 'browser', 'main'],
  alias: {
    react: 'preact/compat/dist/compat.module.js',
    'react-dom': 'preact/compat/dist/compat.module.js',
    ...(process.env.LEGACY ? {
      '../_utils/tesseractWorker.js': 'lodash/noop',
      'emoji-mart/dist-modern/components/picker/nimble-picker': 'emoji-mart/dist-es/components/picker/nimble-picker',
      'emoji-regex/es2015/text': 'emoji-regex/text',
      'page-lifecycle/dist/lifecycle.mjs': 'page-lifecycle/dist/lifecycle.es5.js',
      './SvgIcon.html': './SvgIconLegacy.html',
      '../SvgIcon.html': '../SvgIconLegacy.html',
      '../../SvgIcon.html': '../../SvgIconLegacy.html',
      '../../_components/SvgIcon.html': '../../_components/SvgIconLegacy.html',
      '../../../_components/SvgIcon.html': '../../../_components/SvgIconLegacy.html'
    } : {
      // these polyfills are only needed in legacy mode
      'array-flat-polyfill': 'lodash/noop',
      'indexeddb-getall-shim': 'lodash/noop',
      intl: 'lodash/noop',
      'intersection-observer': 'lodash/noop',
      '@webcomponents/custom-elements': 'lodash/noop',
      '@webcomponents/shadydom': 'lodash/noop',
      './routes/_thirdparty/regenerator-runtime/runtime.js': 'lodash/noop',
      '../_thirdparty/regenerator-runtime/runtime.js': 'lodash/noop'
    })
  }
}

module.exports = {
  mode,
  dev,
  resolve,
  inlineSvgs,
  allSvgs
}
