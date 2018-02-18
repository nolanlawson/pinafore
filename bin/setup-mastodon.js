const pify = require('pify')
const exec = require('child-process-promise').exec;
const dir = __dirname
const path = require('path')
const fs = require('fs')
const exists = pify(fs.exists.bind(fs))
const writeFile = pify(fs.writeFile.bind(fs))

const envFile = `
PAPERCLIP_SECRET=foo
SECRET_KEY_BASE=bar
OTP_SECRET=foobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobar
`

async function main() {
  let mastodonDir = path.join(dir, '../mastodon')
  if (!(await exists(mastodonDir))) {
    await exec(`git clone https://github.com/tootsuite/mastodon "${mastodonDir}"`)
    await exec(`git checkout v2.2.0`, {cwd: mastodonDir})
    await writeFile(path.join(dir, '../mastodon/.env'), envFile, 'utf8')
  }

  await exec(`gem install bundler`, {cwd: mastodonDir})
  await exec(`gem install foreman`, {cwd: mastodonDir})
  await exec(`bundle install`, {cwd: mastodonDir})
  await exec(`yarn --pure-lockfile`, {cwd: mastodonDir})
  await exec(`foreman start`, {cwd: mastodonDir})
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
