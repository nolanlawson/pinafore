#!/usr/bin/env node

const crypto = require('crypto')
const fs = require('fs')
const pify = require('pify')
const readFile = pify(fs.readFile.bind(fs))
const writeFile = pify(fs.writeFile.bind(fs))
const path = require('path')

async function main () {
  let headScriptFilepath = path.join(__dirname, '../inline-script.js')
  let headScript = await readFile(headScriptFilepath, 'utf8')
  headScript = `(function () {'use strict'; ${headScript}})()`

  let checksum = crypto.createHash('sha256').update(headScript).digest('base64')

  let checksumFilepath = path.join(__dirname, '../inline-script-checksum.json')
  await writeFile(checksumFilepath, JSON.stringify({ checksum }), 'utf8')

  let htmlTemplateFilepath = path.join(__dirname, '../routes/template.html')
  let htmlTemplateFile = await readFile(htmlTemplateFilepath, 'utf8')
  htmlTemplateFile = htmlTemplateFile.replace(
    /<!-- insert inline script here -->[\s\S]+<!-- end insert inline script here -->/,
    '<!-- insert inline script here --><script>' + headScript + '</script><!-- end insert inline script here -->'
  )
  await writeFile(htmlTemplateFilepath, htmlTemplateFile, 'utf8')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
