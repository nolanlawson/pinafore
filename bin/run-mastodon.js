const pify = require('pify')
const exec = require('child-process-promise').exec
const spawn = require('child-process-promise').spawn
const dir = __dirname
const path = require('path')
const fs = require('fs')
const stat = pify(fs.stat.bind(fs))
const writeFile = pify(fs.writeFile.bind(fs))
const mkdirp = pify(require('mkdirp'))
const waitForMastodonToStart = require('./wait-for-mastodon-to-start')
const pgPromise = require('pg-promise')

const envFile = `
PAPERCLIP_SECRET=foo
SECRET_KEY_BASE=bar
OTP_SECRET=foobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobar
`

const mastodonDir = path.join(dir, '../mastodon')

let childProc

async function cloneMastodon () {
  try {
    await stat(mastodonDir)
  } catch (e) {
    console.log('Cloning mastodon...')
    await exec(`git clone https://github.com/tootsuite/mastodon "${mastodonDir}"`)
    await exec(`git checkout v2.2.0`, {cwd: mastodonDir})
    await writeFile(path.join(dir, '../mastodon/.env'), envFile, 'utf8')
  }
}

async function restoreMastodonData () {
  console.log('Restoring mastodon data...')
  try {
    await exec('dropdb mastodon_development', {cwd: mastodonDir})
  } catch (e) { /* ignore */ }
  await exec('createdb mastodon_development', {cwd: mastodonDir})

  let dumpFile = path.join(dir, '../fixtures/dump.sql')
  await exec(`pg_restore -Fc -d mastodon_development "${dumpFile}"`, {cwd: mastodonDir})

  let tgzFile = path.join(dir, '../fixtures/system.tgz')
  let systemDir = path.join(mastodonDir, 'public/system')
  await mkdirp(systemDir)
  await exec(`tar -xzf "${tgzFile}"`, {cwd: systemDir})
}

async function modifyMastodonData () {
  const pgp = pgPromise()
  const db = pgp({
    host: '127.0.0.1',
    port: 5432,
    database: 'mastodon_development',
    user: process.env.USER
  })

  let tables = [
    'users', 'statuses', 'status_pins', 'conversations', 'oauth_access_grants',
    'oauth_applications', 'session_activations', 'web_settings', 'oauth_access_tokens',
    'mentions', 'notifications', 'favourites', 'follows', 'media_attachments',
    'preview_cards', 'stream_entries'
  ]
  for (let table of tables) {
    let results = await db.any(
      `SELECT id FROM ${table} ORDER BY created_at DESC`,
      [])
    let referenceDate = Date.now() - (24 * 60 * 60 * 1000)

    let count = 0
    for (let row of results) {
      let updated = new Date(referenceDate - (1000 * ++count))
      let created = new Date(referenceDate - (1000 * ++count))
      try {
        await db.none(
          `UPDATE ${table} SET updated_at = $1, created_at = $2 WHERE id = $3`,
          [updated, created, row.id])
      } catch (e) {
        await db.none(
          `UPDATE ${table} SET created_at = $1 WHERE id = $2`,
          [created, row.id])
      }
    }
  }
  db.$pool.end()
}

async function runMastodon () {
  console.log('Running mastodon...')
  let cmds = [
    'gem install bundler',
    'gem install foreman',
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

  await waitForMastodonToStart()
}

async function main () {
  await cloneMastodon()
  await restoreMastodonData()
  await modifyMastodonData()
  await runMastodon()
}

process.on('SIGINT', function () {
  if (childProc) {
    console.log('killing child process')
    childProc.kill()
  }
  process.exit(0)
})

main().catch(err => {
  console.error(err)
  process.exit(1)
})
