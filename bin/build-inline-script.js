#!/usr/bin/env node

import crypto from 'crypto'
import fs from 'fs'
import pify from 'pify'
import path from 'path'
import { rollup } from 'rollup'
import { terser } from 'rollup-plugin-terser'
import replace from 'rollup-plugin-replace'
import fromPairs from 'lodash-es/fromPairs'
import { themes } from '../src/routes/_static/themes'

const readFile = pify(fs.readFile.bind(fs))
const writeFile = pify(fs.writeFile.bind(fs))

const themeColors = fromPairs(themes.map(_ => ([_.name, _.color])))

async function main () {
  let inlineScriptPath = path.join(__dirname, '../inline-script.js')

  let bundle = await rollup({
    input: inlineScriptPath,
    plugins: [
      replace({
        'process.browser': true,
        'process.env.THEME_COLORS': JSON.stringify(themeColors)
      }),
      terser({
        mangle: true,
        compress: true
      })
    ]
  })
  let { code, map } = await bundle.generate({
    format: 'iife',
    sourcemap: true
  })

  let fullCode = `${code}\n//# sourceMappingURL=/inline-script.js.map`

  let checksum = crypto.createHash('sha256').update(fullCode).digest('base64')

  let checksumFilepath = path.join(__dirname, '../inline-script-checksum.json')
  await writeFile(checksumFilepath, JSON.stringify({ checksum }), 'utf8')

  let htmlTemplateFilepath = path.join(__dirname, '../src/template.html')
  let htmlTemplateFile = await readFile(htmlTemplateFilepath, 'utf8')
  htmlTemplateFile = htmlTemplateFile.replace(
    /<!-- insert inline script here -->[\s\S]+<!-- end insert inline script here -->/,
    '<!-- insert inline script here --><script>' + fullCode + '</script><!-- end insert inline script here -->'
  )
  await writeFile(htmlTemplateFilepath, htmlTemplateFile, 'utf8')

  await writeFile(path.resolve(__dirname, '../static/inline-script.js.map'), map.toString(), 'utf8')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
