#!/usr/bin/env node

const svgs = require('./svgs')
const path = require('path')
const fs = require('fs')
const pify = require('pify')
const SVGO = require('svgo')
const svgo = new SVGO()
const $ = require('cheerio')

const readFile = pify(fs.readFile.bind(fs))
const writeFile = pify(fs.writeFile.bind(fs))

async function main () {
  let result = (await Promise.all(svgs.map(async svg => {
    let filepath = path.join(__dirname, '../', svg.src)
    let content = await readFile(filepath, 'utf8')
    let optimized = (await svgo.optimize(content))
    let $optimized = $(optimized.data)
    let $path = $optimized.find('path').removeAttr('fill')
    let $symbol = $('<symbol></symbol>')
      .attr('id', svg.id)
      .attr('viewBox', `0 0 ${optimized.info.width} ${optimized.info.height}`)
      .append($path)
    return $.xml($symbol)
  }))).join('\n')

  result = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none;">\n${result}\n</svg>`

  let htmlTemplateFilepath = path.join(__dirname, '../src/template.html')
  let htmlTemplateFile = await readFile(htmlTemplateFilepath, 'utf8')
  htmlTemplateFile = htmlTemplateFile.replace(
    /<!-- insert svg here -->[\s\S]+<!-- end insert svg here -->/,
    '<!-- insert svg here -->' + result + '<!-- end insert svg here -->'
  )
  await writeFile(htmlTemplateFilepath, htmlTemplateFile, 'utf8')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
