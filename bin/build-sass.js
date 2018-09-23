#!/usr/bin/env node

const sass = require('node-sass')
const chokidar = require('chokidar')
const path = require('path')
const debounce = require('lodash/debounce')
const fs = require('fs')
const pify = require('pify')
const writeFile = pify(fs.writeFile.bind(fs))
const readdir = pify(fs.readdir.bind(fs))
const readFile = pify(fs.readFile.bind(fs))
const render = pify(sass.render.bind(sass))
const now = require('performance-now')

const globalScss = path.join(__dirname, '../scss/global.scss')
const defaultThemeScss = path.join(__dirname, '../scss/themes/_default.scss')
const offlineThemeScss = path.join(__dirname, '../scss/themes/_offline.scss')
const html2xxFile = path.join(__dirname, '../templates/2xx.html')
const scssDir = path.join(__dirname, '../scss')
const themesScssDir = path.join(__dirname, '../scss/themes')
const assetsDir = path.join(__dirname, '../assets')

function doWatch () {
  let start = now()
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

async function compileGlobalSass () {
  let results = await Promise.all([
    render({ file: defaultThemeScss, outputStyle: 'compressed' }),
    render({ file: globalScss, outputStyle: 'compressed' }),
    render({ file: offlineThemeScss, outputStyle: 'compressed' })
  ])

  let css = results.map(_ => _.css).join('')

  let html = await readFile(html2xxFile, 'utf8')
  html = html.replace(/<style>[\s\S]+?<\/style>/,
    `<style>\n/* auto-generated w/ build-sass.js */\n${css}\n</style>`)

  await writeFile(html2xxFile, html, 'utf8')
}

async function compileThemesSass () {
  let files = (await readdir(themesScssDir)).filter(file => !path.basename(file).startsWith('_'))
  await Promise.all(files.map(async file => {
    let res = await render({ file: path.join(themesScssDir, file), outputStyle: 'compressed' })
    let outputFilename = 'theme-' + path.basename(file).replace(/\.scss$/, '.css')
    await writeFile(path.join(assetsDir, outputFilename), res.css, 'utf8')
  }))
}

async function main () {
  await Promise.all([compileGlobalSass(), compileThemesSass()])
  if (process.argv.includes('--watch')) {
    doWatch()
  }
}

Promise.resolve().then(main).catch(err => {
  console.error(err)
  process.exit(1)
})
