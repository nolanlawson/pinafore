import { restoreMastodonData } from './restore-mastodon-data'
import { promisify } from 'util'
import childProcessPromise from 'child-process-promise'
import path from 'path'
import fs from 'fs'
import { waitForMastodonUiToStart, waitForMastodonApiToStart } from './wait-for-mastodon-to-start'
import mkdirp from 'mkdirp'
import cloneMastodon from './clone-mastodon'
import { DB_USER, DB_PASS, DB_NAME, DB_HOST, DB_PORT } from './mastodon-config'

const exec = childProcessPromise.exec
const spawn = childProcessPromise.spawn
const stat = promisify(fs.stat)
const writeFile = promisify(fs.writeFile)
const dir = __dirname
const mastodonDir = path.join(dir, '../mastodon')

let childProc

async function setupMastodonDatabase () {
  console.log('Setting up mastodon database...')
  try {
    await exec(`psql -d template1 -c "CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASS}' CREATEDB;"`)
  } catch (e) { /* ignore */ }
  try {
    await exec(`dropdb -h 127.0.0.1 -U ${DB_USER} -w ${DB_NAME}`, {
      cwd: mastodonDir,
      env: Object.assign({ PGPASSWORD: DB_PASS }, process.env)
    })
  } catch (e) { /* ignore */ }
  await exec(`createdb -h 127.0.0.1 -U ${DB_USER} -w ${DB_NAME}`, {
    cwd: mastodonDir,
    env: Object.assign({ PGPASSWORD: DB_PASS }, process.env)
  })

  const dumpFile = path.join(dir, '../tests/fixtures/dump.sql')
  await exec(`psql -h 127.0.0.1 -U ${DB_USER} -w -d ${DB_NAME} -f "${dumpFile}"`, {
    cwd: mastodonDir,
    env: Object.assign({ PGPASSWORD: DB_PASS }, process.env)
  })

  const tgzFile = path.join(dir, '../tests/fixtures/system.tgz')
  const systemDir = path.join(mastodonDir, 'public/system')
  await mkdirp(systemDir)
  await exec(`tar -xzf "${tgzFile}"`, { cwd: systemDir })
}

async function runMastodon () {
  console.log('Running mastodon...')
  const env = Object.assign({}, process.env, {
    RAILS_ENV: 'development',
    NODE_ENV: 'development',
    DB_NAME,
    DB_USER,
    DB_PASS,
    DB_HOST,
    DB_PORT
  })
  const cwd = mastodonDir
  const cmds = [
    'gem install bundler foreman',
    'bundle install',
    'bundle exec rails db:migrate',
    'yarn --pure-lockfile'
  ]

  const installedFile = path.join(mastodonDir, 'installed.txt')
  try {
    await stat(installedFile)
    console.log('Already installed Mastodon')
  } catch (e) {
    console.log('Installing Mastodon...')
    for (const cmd of cmds) {
      console.log(cmd)
      await exec(cmd, { cwd, env })
    }
    await writeFile(installedFile, '', 'utf8')
  }
  const promise = spawn('foreman', ['start'], { cwd, env })
  // don't bother writing to mastodon.log in CI; we can't read the file anyway
  const logFile = process.env.CIRCLECI ? '/dev/null' : 'mastodon.log'
  const log = fs.createWriteStream(logFile, { flags: 'a' })
  childProc = promise.childProcess
  childProc.stdout.pipe(log)
  childProc.stderr.pipe(log)
  promise.catch(err => {
    console.error('foreman start failed, see mastodon.log for details')
    console.error(err)
    shutdownMastodon()
    process.exit(1)
  })
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
