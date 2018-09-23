#!/usr/bin/env node

import crypto from 'crypto'
import fs from 'fs'
import pify from 'pify'
import path from 'path'
import { themes } from '../routes/_static/themes.js'
import { fromPairs } from 'lodash-es'

const readFile = pify(fs.readFile.bind(fs))
const writeFile = pify(fs.writeFile.bind(fs))

async function main () {

  let inlineScriptPath = path.join(__dirname, '../inline-script.js')
  let code = await readFile(inlineScriptPath, 'utf8')

  code = code.replace('process.env.THEME_COLORS', JSON.stringify(fromPairs(themes.map(_ => ([_.name, _.color])))))
  code = `(function () {'use strict'\n${code}})()`

  let checksum = crypto.createHash('sha256').update(code).digest('base64')

  let checksumFilepath = path.join(__dirname, '../inline-script-checksum.json')
  await writeFile(checksumFilepath, JSON.stringify({ checksum }), 'utf8')

  let html2xxFilepath = path.join(__dirname, '../templates/2xx.html')
  let html2xxFile = await readFile(html2xxFilepath, 'utf8')
  html2xxFile = html2xxFile.replace(
    /<!-- insert inline script here -->[\s\S]+<!-- end insert inline script here -->/,
    '<!-- insert inline script here --><script>' + code + '</script><!-- end insert inline script here -->'
  )
  await writeFile(html2xxFilepath, html2xxFile, 'utf8')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
