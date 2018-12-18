import path from 'path'
import fs from 'fs'
import pify from 'pify'
import CleanCSS from 'clean-css'

const writeFile = pify(fs.writeFile.bind(fs))
const readFile = pify(fs.readFile.bind(fs))
const copyFile = pify(fs.copyFile.bind(fs))

async function compileThirdPartyCss () {
  let css = await readFile(path.resolve(__dirname, '../node_modules/emoji-mart/css/emoji-mart.css'), 'utf8')
  css = `/* compiled from emoji-mart.css */` + new CleanCSS().minify(css).styles
  await writeFile(path.resolve(__dirname, '../static/emoji-mart.css'), css, 'utf8')
}

async function compileThirdPartyJson () {
  await copyFile(
    path.resolve(__dirname, '../node_modules/emoji-mart/data/all.json'),
    path.resolve(__dirname, '../static/emoji-mart-all.json')
  )
}

async function main () {
  await Promise.all([
    compileThirdPartyCss(),
    compileThirdPartyJson()
  ])
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
