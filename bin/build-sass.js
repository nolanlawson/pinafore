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
const customScrollbarScss = path.join(__dirname, '../scss/custom-scrollbars.scss')
const htmlTemplateFile = path.join(__dirname, '../src/template.html')
const scssDir = path.join(__dirname, '../scss')
const themesScssDir = path.join(__dirname, '../scss/themes')
const assetsDir = path.join(__dirname, '../static')

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

async function renderCss (file) {
  return (await render({ file, outputStyle: 'compressed' })).css
}

async function compileGlobalSass () {
  let mainStyle = (await Promise.all([defaultThemeScss, globalScss].map(renderCss))).join('')
  let offlineStyle = (await renderCss(offlineThemeScss))
  let scrollbarStyle = (await renderCss(customScrollbarScss))

  let html = await readFile(htmlTemplateFile, 'utf8')
  html = html.replace(/<!-- begin inline CSS -->[\s\S]+<!-- end inline CSS -->/,
    `<!-- begin inline CSS -->\n` +
    `<style>\n${mainStyle}</style>\n` +
    `<style media="only x" id="theOfflineStyle">\n${offlineStyle}</style>\n` +
    `<style media="all" id="theScrollbarStyle">\n${scrollbarStyle}</style>\n` +
    `<!-- end inline CSS -->`
  )

  await writeFile(htmlTemplateFile, html, 'utf8')
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
