import crypto from 'crypto'
import fs from 'fs'
import { promisify } from 'util'
import path from 'path'
import { rollup } from 'rollup'
import { terser } from 'rollup-plugin-terser'
import replace from 'rollup-plugin-replace'
import fromPairs from 'lodash-es/fromPairs'
import { themes } from '../src/routes/_static/themes'

const writeFile = promisify(fs.writeFile)

const themeColors = fromPairs(themes.map(_ => ([_.name, _.color])))

export async function buildInlineScript () {
  let inlineScriptPath = path.join(__dirname, '../src/inline-script/inline-script.js')

  let bundle = await rollup({
    input: inlineScriptPath,
    plugins: [
      replace({
        'process.browser': true,
        'process.env.THEME_COLORS': JSON.stringify(themeColors)
      }),
      terser({
        mangle: true,
        compress: true
      })
    ]
  })
  let { output } = await bundle.generate({
    format: 'iife',
    sourcemap: true
  })

  let { code, map } = output[0]

  let fullCode = `${code}//# sourceMappingURL=/inline-script.js.map`
  let checksum = crypto.createHash('sha256').update(fullCode).digest('base64')

  await writeFile(path.resolve(__dirname, '../src/inline-script/checksum.js'),
    `module.exports = ${JSON.stringify(checksum)}`, 'utf8')
  await writeFile(path.resolve(__dirname, '../static/inline-script.js.map'),
    map.toString(), 'utf8')

  return '<script>' + fullCode + '</script>'
}
