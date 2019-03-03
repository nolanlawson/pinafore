import svgs from './svgs'
import path from 'path'
import fs from 'fs'
import { promisify } from 'util'
import SVGO from 'svgo'
import $ from 'cheerio'

const svgo = new SVGO()
const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

async function readSvg (svg) {
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
}

export async function buildSvg () {
  let inlineSvgs = svgs.filter(_ => _.inline)
  let regularSvgs = svgs.filter(_ => !_.inline)

  let inlineSvgStrings = (await Promise.all(inlineSvgs.map(readSvg))).join('')
  let regularSvgStrings = (await Promise.all(regularSvgs.map(readSvg))).join('')

  let inlineOutput = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">${inlineSvgStrings}</svg>`
  let regularOutput = `<svg xmlns="http://www.w3.org/2000/svg">${regularSvgStrings}</svg>`

  await writeFile(path.resolve(__dirname, '../static/icons.svg'), regularOutput, 'utf8')

  return inlineOutput
}
