import crypto from 'crypto'
import fs from 'fs'
import { promisify } from 'util'
import path from 'path'
import { rollup } from 'rollup'
import { terser } from 'rollup-plugin-terser'
import replace from '@rollup/plugin-replace'
import fromPairs from 'lodash-es/fromPairs'
import { themes } from '../src/routes/_static/themes'
import terserOptions from './terserOptions'

const writeFile = promisify(fs.writeFile)

const themeColors = fromPairs(themes.map(_ => ([_.name, _.color])))

export async function buildInlineScript () {
  const inlineScriptPath = path.join(__dirname, '../src/inline-script/inline-script.js')

  const bundle = await rollup({
    input: inlineScriptPath,
    plugins: [
      replace({
        values: {
          'process.browser': true,
          'process.env.THEME_COLORS': JSON.stringify(themeColors)
        },
        preventAssignment: true
      }),
      // TODO: can't disable terser at all, it causes the CSP checksum to stop working
      // because the HTML gets minified as some point so the checksums don't match.
      terser({ ...terserOptions, mangle: !process.env.DEBUG })
    ]
  })
  const { output } = await bundle.generate({
    format: 'iife',
    sourcemap: true
  })

  const { code, map } = output[0]

  const fullCode = `${code}//# sourceMappingURL=/inline-script.js.map`
  const checksum = crypto.createHash('sha256').update(fullCode, 'utf8').digest('base64')

  await writeFile(path.resolve(__dirname, '../src/inline-script/checksum.js'),
    `module.exports = ${JSON.stringify(checksum)}`, 'utf8')
  await writeFile(path.resolve(__dirname, '../static/inline-script.js.map'),
    map.toString(), 'utf8')

  return '<script>' + fullCode + '</script>'
}
