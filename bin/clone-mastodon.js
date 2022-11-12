import { promisify } from 'util'
import childProcessPromise from 'child-process-promise'
import path from 'path'
import fs from 'fs'
import { envFile, RUBY_VERSION } from './mastodon-config.js'
import esMain from 'es-main'

const exec = childProcessPromise.exec
const stat = promisify(fs.stat)
const writeFile = promisify(fs.writeFile)
const __dirname = path.dirname(new URL(import.meta.url).pathname)
const dir = __dirname

const GIT_URL = 'https://github.com/tootsuite/mastodon.git'
const GIT_TAG = 'v3.5.3'

const mastodonDir = path.join(dir, '../mastodon')

export default async function cloneMastodon () {
  try {
    await stat(mastodonDir)
  } catch (e) {
    console.log('Cloning mastodon...')
    await exec(`git clone --single-branch --branch ${GIT_TAG} ${GIT_URL} "${mastodonDir}"`)
    await writeFile(path.join(dir, '../mastodon/.env'), envFile, 'utf8')
    await writeFile(path.join(dir, '../mastodon/.ruby-version'), RUBY_VERSION, 'utf8')
  }
}

if (esMain(import.meta)) {
  cloneMastodon().catch(err => {
    console.error(err)
    process.exit(1)
  })
}
