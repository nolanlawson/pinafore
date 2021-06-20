import svgs from './svgs'
import path from 'path'
import fs from 'fs'
import { promisify } from 'util'
import { optimize } from 'svgo'
const { JSDOM } = require('jsdom')

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

async function readSvg (svg) {
  const filepath = path.join(__dirname, '../', svg.src)
  const content = await readFile(filepath, 'utf8')
  const optimized = (await optimize(content, { multipass: true }))
  const { document } = new JSDOM(optimized.data).window
  const $path = document.querySelector('path, circle')
  $path.removeAttribute('fill')
  const $svg = document.querySelector('svg')
  const viewBox = $svg.getAttribute('viewBox') || `0 0 ${$svg.getAttribute('width')} ${$svg.getAttribute('height')}`
  const $symbol = document.createElement('symbol')
  $symbol.setAttribute('id', svg.id)
  $symbol.setAttribute('viewBox', viewBox)
  $symbol.appendChild($path)
  return $symbol.outerHTML.replace(/viewbox/g, 'viewBox') // jsdom serializes it incorrectly as `viewbox` not `viewBox`
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
