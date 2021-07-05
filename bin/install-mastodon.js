import { promisify } from 'util'
import childProcessPromise from 'child-process-promise'
import path from 'path'
import fs from 'fs'
import { DB_NAME, DB_PASS, DB_USER, mastodonDir, env } from './mastodon-config.js'
import mkdirp from 'mkdirp'
import esMain from 'es-main'

const exec = childProcessPromise.exec
const stat = promisify(fs.stat)
const writeFile = promisify(fs.writeFile)
const __dirname = path.dirname(new URL(import.meta.url).pathname)
const dir = __dirname

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

async function installMastodonDependencies () {
  const cwd = mastodonDir
  const installCommands = [
    'gem update --system',
    'gem install bundler foreman',
    'bundle config set --local frozen \'true\'',
    'bundle install',
    'yarn --pure-lockfile'
  ]

  const installedFile = path.join(mastodonDir, 'installed.txt')
  try {
    await stat(installedFile)
    console.log('Already installed Mastodon dependencies')
  } catch (e) {
    console.log('Installing Mastodon dependencies...')
    for (const cmd of installCommands) {
      console.log(cmd)
      await exec(cmd, { cwd, env })
    }
    await writeFile(installedFile, '', 'utf8')
  }
  await exec('bundle exec rails db:migrate', { cwd, env })
}

export default async function installMastodon () {
  console.log('Installing Mastodon...')
  await setupMastodonDatabase()
  await installMastodonDependencies()
}

if (esMain(import.meta)) {
  installMastodon().catch(err => {
    console.error(err)
    process.exit(1)
  })
}
