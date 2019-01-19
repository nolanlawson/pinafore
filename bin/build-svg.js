import svgs from './svgs'
import path from 'path'
import fs from 'fs'
import { promisify } from 'util'
import SVGO from 'svgo'
import $ from 'cheerio'

const svgo = new SVGO()
const readFile = promisify(fs.readFile)

export async function buildSvg () {
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

  return `<svg xmlns="http://www.w3.org/2000/svg" style="display:none;">\n${result}\n</svg>`
}
