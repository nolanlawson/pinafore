#!/usr/bin/env node

import crypto from 'crypto'
import fs from 'fs'
import pify from 'pify'
import path from 'path'
import { rollup } from 'rollup'
import replace from 'rollup-plugin-replace'
import { themes } from '../routes/_static/themes.js'
import { fromPairs } from 'lodash-es'

const readFile = pify(fs.readFile.bind(fs))
const writeFile = pify(fs.writeFile.bind(fs))

async function main () {
  let bundle = await rollup({
    input: path.join(__dirname, '../inline-script.js'),
    plugins: [
      replace({
        'process.env.THEME_COLORS': JSON.stringify(fromPairs(themes.map(_ => ([_.name, _.color]))))
      })
    ]
  })

  let { code } = await bundle.generate({ format: 'iife' })

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
