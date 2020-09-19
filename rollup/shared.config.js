import svgs from '../bin/svgs'
import fs from 'fs'
import $ from 'cheerio'

const inlineSvgs = svgs.filter(_ => _.inline).map(_ => `#${_.id}`)
const allSvgs = {}
const $inlineHtml = $(fs.readFileSync('./src/template.html', 'utf8'))
const $externalSvgs = $(fs.readFileSync('./static/icons.svg', 'utf8'))
svgs.forEach(_ => {
  const $inlineSvg = $inlineHtml.find(`#${_.id}`)
  const $svg = $inlineSvg.length ? $inlineSvg : $externalSvgs.find(`#${_.id}`)

  allSvgs[`#${_.id}`] = {
    viewBox: $svg.attr('viewBox'),
    html: $svg.html()
  }
})
const mode = process.env.NODE_ENV || 'production'
const dev = mode === 'development'

export {
  mode,
  dev,
  inlineSvgs,
  allSvgs
}
