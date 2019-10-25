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
  const filepath = path.join(__dirname, '../', svg.src)
  const content = await readFile(filepath, 'utf8')
  const optimized = (await svgo.optimize(content))
  const $optimized = $(optimized.data)
  const $path = $optimized.find('path').removeAttr('fill')
  const $symbol = $('<symbol></symbol>')
    .attr('id', svg.id)
    .attr('viewBox', $optimized.attr('viewBox'))
    .append($path)
  return $.xml($symbol)
}

export async function buildSvg () {
  const inlineSvgs = svgs.filter(_ => _.inline)
  const regularSvgs = svgs.filter(_ => !_.inline)

  const inlineSvgStrings = (await Promise.all(inlineSvgs.map(readSvg))).join('')
  const regularSvgStrings = (await Promise.all(regularSvgs.map(readSvg))).join('')

  const inlineOutput = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">${inlineSvgStrings}</svg>`
  const regularOutput = `<svg xmlns="http://www.w3.org/2000/svg">${regularSvgStrings}</svg>`

  await writeFile(path.resolve(__dirname, '../static/icons.svg'), regularOutput, 'utf8')

  return inlineOutput
}
