const fetch = require('node-fetch')

async function waitForMastodonToStart () {
  while (true) {
    try {
      let json = await ((await fetch('http://127.0.0.1:3000/api/v1/instance')).json())
      let html = await ((await fetch('http://127.0.0.1:3035/packs/common.js')).text())
      if (json.uri && html) {
        break
      }
    } catch (err) {
      console.log('Waiting for Mastodon to start up...')
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }
  console.log('Mastodon started up')
}

module.exports = waitForMastodonToStart

if (require.main === module) {
  waitForMastodonToStart().catch(err => {
    console.error(err)
    process.exit(1)
  })
}
