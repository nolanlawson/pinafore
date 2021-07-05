import fetch from 'node-fetch'
import esMain from 'es-main'

export async function waitForMastodonUiToStart () {
  while (true) {
    try {
      const html = await ((await fetch('http://127.0.0.1:3035/packs/common.js')).text())
      if (html) {
        break
      }
    } catch (err) {
      console.log('Waiting for Mastodon UI to start up...')
      await new Promise(resolve => setTimeout(resolve, 5000))
    }
  }
  console.log('Mastodon UI started up')
}

export async function waitForMastodonApiToStart () {
  while (true) {
    try {
      const json = await ((await fetch('http://127.0.0.1:3000/api/v1/instance')).json())
      if (json.uri) {
        break
      }
    } catch (err) {
      console.log('Waiting for Mastodon API to start up...')
      await new Promise(resolve => setTimeout(resolve, 5000))
    }
  }
  console.log('Mastodon API started up')
}

if (esMain(import.meta)) {
  Promise.resolve()
    .then(waitForMastodonApiToStart)
    .then(waitForMastodonUiToStart).catch(err => {
      console.error(err)
      process.exit(1)
    })
}
