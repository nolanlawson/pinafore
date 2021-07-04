import chokidar from 'chokidar'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import { buildSass } from './build-sass'
import { buildInlineScript } from './build-inline-script'
import { buildSvg } from './build-svg'
import { performance } from 'perf_hooks'
import debounce from 'lodash-es/debounce'
import applyIntl from '../webpack/svelte-intl-loader'
import { LOCALE } from '../src/routes/_static/intl'
import { getLangDir } from 'rtl-detect'

const writeFile = promisify(fs.writeFile)
const LOCALE_DIRECTION = getLangDir(LOCALE)
const DEBOUNCE = 500

const builders = [
  {
    watch: 'src/scss',
    comment: '<!-- inline CSS -->',
    rebuild: buildSass
  },
  {
    watch: 'src/inline-script/inline-script.js',
    comment: '<!-- inline JS -->',
    rebuild: buildInlineScript
  },
  {
    watch: 'bin/svgs.js',
    comment: '<!-- inline SVG -->',
    rebuild: buildSvg
  }
]

// array of strings and builder functions, we build this on-the-fly
const partials = buildPartials()

function buildPartials () {
  const rawTemplate = fs.readFileSync(path.resolve(__dirname, '../src/build/template.html'), 'utf8')

  const partials = [rawTemplate]

  builders.forEach(builder => {
    for (let i = 0; i < partials.length; i++) {
      const partial = partials[i]
      if (typeof partial !== 'string') {
        continue
      }
      const idx = partial.indexOf(builder.comment)
      if (idx !== -1) {
        partials.splice(
          i,
          1,
          partial.substring(0, idx),
          builder,
          partial.substring(idx + builder.comment.length)
        )
        break
      }
    }
  })

  return partials
}

function doWatch () {
  // rebuild each of the partials on-the-fly if something changes
  partials.forEach(partial => {
    if (typeof partial === 'string') {
      return
    }

    chokidar.watch(partial.watch).on('change', debounce(path => {
      console.log(`Detected change in ${path}...`)
      delete partial.result
      buildAll()
    }), DEBOUNCE)
  })
}

async function buildAll () {
  const start = performance.now()
  let html = (await Promise.all(partials.map(async partial => {
    if (typeof partial === 'string') {
      return partial
    }
    if (!partial.result) {
      partial.result = partial.comment + '\n' + (await partial.rebuild())
    }
    return partial.result
  }))).join('')

  html = applyIntl(html)
    .replace('{process.env.LOCALE}', LOCALE)
    .replace('{process.env.LOCALE_DIRECTION}', LOCALE_DIRECTION)
  await writeFile(path.resolve(__dirname, '../src/template.html'), html, 'utf8')
  const end = performance.now()
  console.log(`Built template.html in ${(end - start).toFixed(2)}ms`)
}

async function main () {
  if (process.argv.includes('--watch')) {
    doWatch()
  } else {
    await buildAll()
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
