import svgs from './svgs'
import path from 'path'
import fs from 'fs'
import { promisify } from 'util'
import { optimize } from 'svgo'
import $ from 'cheerio'

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

async function readSvg (svg) {
  const filepath = path.join(__dirname, '../', svg.src)
  const content = await readFile(filepath, 'utf8')
  const optimized = (await optimize(content, { multipass: true }))
  const $optimized = $(optimized.data)
  const $path = $optimized.find('path, circle').removeAttr('fill')
  const viewBox = $optimized.attr('viewBox') || `0 0 ${$optimized.attr('width')} ${$optimized.attr('height')}`
  const $symbol = $('<symbol></symbol>')
    .attr('id', svg.id)
    .attr('viewBox', viewBox)
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
