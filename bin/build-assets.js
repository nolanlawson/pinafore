import path from 'path'
import fs from 'fs'
import { promisify } from 'util'
import trimEmojiData from 'emoji-picker-element/trimEmojiData.cjs'

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

async function main () {
  let json = JSON.parse(await readFile(
    path.resolve(__dirname, '../node_modules/emojibase-data/en/data.json'),
    'utf8')
  )
  json = trimEmojiData(json)
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
