import { restoreMastodonData } from './restore-mastodon-data'
import childProcessPromise from 'child-process-promise'
import fs from 'fs'
import { waitForMastodonUiToStart, waitForMastodonApiToStart } from './wait-for-mastodon-to-start'
import cloneMastodon from './clone-mastodon'
import installMastodon from './install-mastodon'
import { mastodonDir, env } from './mastodon-config'

const spawn = childProcessPromise.spawn

let childProc

async function runMastodon () {
  console.log('Running mastodon...')
  const cwd = mastodonDir
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
  await installMastodon()
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
