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
