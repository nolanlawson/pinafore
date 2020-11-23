import { promisify } from 'util'
import childProcessPromise from 'child-process-promise'
import path from 'path'
import fs from 'fs'
import { envFile } from './mastodon-config'

const exec = childProcessPromise.exec
const stat = promisify(fs.stat)
const writeFile = promisify(fs.writeFile)
const dir = __dirname

const GIT_URL = 'https://github.com/tootsuite/mastodon.git'
const GIT_TAG = 'v3.1.3'

const mastodonDir = path.join(dir, '../mastodon')

export default async function cloneMastodon () {
  try {
    await stat(mastodonDir)
  } catch (e) {
    console.log('Cloning mastodon...')
    await exec(`git clone --single-branch --branch ${GIT_TAG} ${GIT_URL} "${mastodonDir}"`)
    await writeFile(path.join(dir, '../mastodon/.env'), envFile, 'utf8')
  }
}

if (require.main === module) {
  cloneMastodon().catch(err => {
    console.error(err)
    process.exit(1)
  })
}
