import path from 'path'
import fs from 'fs'
import { promisify } from 'util'

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

async function main () {
  const json = JSON.parse(await readFile(
    path.resolve(__dirname, '../node_modules/emoji-picker-element-data/en/emojibase-legacy/data.json'),
    'utf8')
  )
  await writeFile(
    path.resolve(__dirname, '../static/emoji-all-en.json'),
    JSON.stringify(json),
    'utf8'
  )
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
