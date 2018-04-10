import { restoreMastodonData } from './restore-mastodon-data'
import pify from 'pify'
import childProcessPromise from 'child-process-promise'
import path from 'path'
import fs from 'fs'
import { waitForMastodonUiToStart, waitForMastodonApiToStart } from './wait-for-mastodon-to-start'
import mkdirpCB from 'mkdirp'

const exec = childProcessPromise.exec
const spawn = childProcessPromise.spawn
const mkdirp = pify(mkdirpCB)
const stat = pify(fs.stat.bind(fs))
const writeFile = pify(fs.writeFile.bind(fs))
const dir = __dirname

const GIT_URL = 'https://github.com/nolanlawson/mastodon'
const GIT_BRANCH = 'for-pinafore'
const DB_USER = 'nolan'

const envFile = `
PAPERCLIP_SECRET=foo
SECRET_KEY_BASE=bar
OTP_SECRET=foobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobar
DB_HOST=127.0.0.1
DB_PORT=${process.env.PGPORT || 5432}
DB_USER=${DB_USER}
`

const mastodonDir = path.join(dir, '../mastodon')

let childProc

async function cloneMastodon () {
  try {
    await stat(mastodonDir)
  } catch (e) {
    console.log('Cloning mastodon...')
    await exec(`git clone ${GIT_URL} "${mastodonDir}"`)
    await exec(`git checkout ${GIT_BRANCH}`, {cwd: mastodonDir})
    await writeFile(path.join(dir, '../mastodon/.env'), envFile, 'utf8')
  }
}

async function setupMastodonDatabase () {
  console.log('Setting up mastodon database...')
  try {
    await exec(`dropdb -h 127.0.0.1 -U ${DB_USER} mastodon_development`, {cwd: mastodonDir})
  } catch (e) { /* ignore */ }
  await exec(`createdb -h 127.0.0.1 -U ${DB_USER} mastodon_development`, {cwd: mastodonDir})

  let dumpFile = path.join(dir, '../fixtures/dump.sql')
  await exec(`pg_restore -h 127.0.0.1 -U ${DB_USER} -Fc -d mastodon_development "${dumpFile}"`, {cwd: mastodonDir})

  let tgzFile = path.join(dir, '../fixtures/system.tgz')
  let systemDir = path.join(mastodonDir, 'public/system')
  await mkdirp(systemDir)
  await exec(`tar -xzf "${tgzFile}"`, {cwd: systemDir})
}

async function runMastodon () {
  console.log('Running mastodon...')
  let cmds = [
    'gem install bundler foreman',
    'bundle install',
    'yarn --pure-lockfile'
  ]

  for (let cmd of cmds) {
    console.log(cmd)
    await exec(cmd, {cwd: mastodonDir})
  }
  const promise = spawn('foreman', ['start'], {cwd: mastodonDir})
  const log = fs.createWriteStream('mastodon.log', {flags: 'a'})
  childProc = promise.childProcess
  childProc.stdout.pipe(log)
  childProc.stderr.pipe(log)
}

async function main () {
  await cloneMastodon()
  await setupMastodonDatabase()
  await runMastodon()
  await waitForMastodonApiToStart()
  await restoreMastodonData()
  await waitForMastodonUiToStart()
}

function shutdownMastodon () {
  if (childProc) {
    console.log('killing child process')
    childProc.kill()
  }
}

process.on('SIGINT', function () {
  shutdownMastodon()
  process.exit(0)
})

main().catch(err => {
  console.error(err)
  shutdownMastodon()
  process.exit(1)
})
