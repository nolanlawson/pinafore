#!/usr/bin/env node

const sass = require('node-sass')
const chokidar = require('chokidar')
const argv = require('yargs').argv
const path = require('path')
const debounce = require('lodash/debounce')
const fs = require('fs')
const pify = require('pify')
const writeFile = pify(fs.writeFile.bind(fs))
const readdir = pify(fs.readdir.bind(fs))
const render = pify(sass.render.bind(sass))
const now = require('performance-now')

const globalScss = path.join(__dirname, '../scss/global.scss')
const defaultThemeScss = path.join(__dirname, '../scss/themes/_default.scss')
const globalCss = path.join(__dirname, '../assets/global.css')
const scssDir = path.join(__dirname, '../scss')
const themesScssDir = path.join(__dirname, '../scss/themes')
const assetsDir = path.join(__dirname, '../assets')

function doWatch() {
  var start = now()
  chokidar.watch(scssDir).on('change', debounce(() => {
    console.log('Recompiling SCSS...')
    Promise.all([
      compileGlobalSass(),
      compileThemesSass()
    ]).then(() => {
      console.log('Recompiled SCSS in ' + (now() - start) + 'ms')
    })
  }, 500))
  chokidar.watch()
}

async function compileGlobalSass() {
  let results = await Promise.all([
    render({file: defaultThemeScss}),
    render({file: globalScss})
  ])

  let css = results.map(_ => _.css).join('\n')

  await writeFile(globalCss, css, 'utf8')
}

async function compileThemesSass() {
  let files = (await readdir(themesScssDir)).filter(file => !path.basename(file).startsWith('_'))
  await Promise.all(files.map(async file => {
    let res = await render({file: path.join(themesScssDir, file)})
    let outputFilename = 'theme-' + path.basename(file).replace(/\.scss$/, '.css')
    await writeFile(path.join(assetsDir, outputFilename), res.css, 'utf8')
  }))
}

async function main() {
  await Promise.all([compileGlobalSass(), compileThemesSass()])
  if (argv.watch) {
    doWatch()
  }
}

Promise.resolve().then(main).catch(err => {
  console.error(err)
  process.exit(1)
})