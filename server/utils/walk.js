import fs from 'fs'
import path from 'path'

export function walk (dir, cb) {
  for (let file of fs.readdirSync(dir)) {
    let absoluteFile = path.resolve(dir, file)
    if (fs.statSync(absoluteFile).isDirectory()) {
      walk(absoluteFile, cb)
    } else {
      cb(absoluteFile)
    }
  }
}
