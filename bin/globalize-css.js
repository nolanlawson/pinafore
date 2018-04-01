#!/usr/bin/env node
// Change all the Svelte CSS to just use globals everywhere,
// to reduce CSS size and complexity.

const argv = require('yargs').argv
const path = require('path')
const fs = require('fs')
const pify = require('pify')
const writeFile = pify(fs.writeFile.bind(fs))
const readFile = pify(fs.readFile.bind(fs))
const glob = pify(require('glob'))
const rimraf = pify(require('rimraf'))

const selectorRegex = /\n[ \t\n]*([0-9\w\- \t\n.:#,]+?)[ \t\n]*{/g
const styleRegex = /<style>[\s\S]+?<\/style>/

async function main () {
  if (argv.reverse) { // reverse the operation we just did
    let tmpComponents = await glob('./routes/**/.tmp-*.html')
    for (let filename of tmpComponents) {
      let text = await readFile(filename, 'utf8')
      await rimraf(filename)
      let originalFilename = path.join(path.dirname(filename), path.basename(filename).substring(5))
      await writeFile(originalFilename, text, 'utf8')
    }
  } else { // read all files, copy to tmp files, rewrite files to include global CSS everywhere
    let components = await glob('./routes/**/*.html')
    for (let filename of components) {
      let text = await readFile(filename, 'utf8')
      let newText = text.replace(styleRegex, style => {
        return style.replace(selectorRegex, selectorMatch => {
          return selectorMatch.replace(/\S[^{]+/, selector => `:global(${selector})`)
        })
      })
      let newFilename = path.join(path.dirname(filename), '.tmp-' + path.basename(filename))

      await writeFile(newFilename, text, 'utf8')
      await writeFile(filename, newText, 'utf8')
    }
  }
}

Promise.resolve().then(main).catch(err => {
  console.error(err)
  process.exit(1)
})
