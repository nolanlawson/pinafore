import chokidar from 'chokidar'
import fs from 'fs'
import path from 'path'
import pify from 'pify'
import { buildSass } from './build-sass'
import { buildInlineScript } from './build-inline-script'
import { buildSvg } from './build-svg'
import now from 'performance-now'
import debounce from 'lodash-es/debounce'

const writeFile = pify(fs.writeFile.bind(fs))

const DEBOUNCE = 500

const builders = [
  {
    watch: 'scss',
    comment: '<!-- inline CSS -->',
    rebuild: buildSass
  },
  {
    watch: 'inline-script.js',
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
  let rawTemplate = fs.readFileSync(path.resolve(__dirname, '../src-build/template.html'), 'utf8')

  let partials = [rawTemplate]

  builders.forEach(builder => {
    for (let i = 0; i < partials.length; i++) {
      let partial = partials[i]
      if (typeof partial !== 'string') {
        continue
      }
      let idx = partial.indexOf(builder.comment)
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
  let start = now()
  let html = (await Promise.all(partials.map(async partial => {
    if (typeof partial === 'string') {
      return partial
    }
    if (!partial.result) {
      partial.result = partial.comment + '\n' + (await partial.rebuild())
    }
    return partial.result
  }))).join('')

  await writeFile(path.resolve(__dirname, '../src/template.html'), html, 'utf8')
  let end = now()
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
