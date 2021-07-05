import fetch from 'node-fetch'
import { actions } from './mastodon-data.js'
import esMain from 'es-main'

const numStatuses = actions
  .map(_ => _.post || _.boost)
  .filter(Boolean)
  .filter(_ => _.privacy !== 'direct')
  .length

async function waitForMastodonData () {
  while (true) {
    try {
      const json = await ((await fetch('http://127.0.0.1:3000/api/v1/instance')).json())
      if (json.stats.status_count === numStatuses) {
        break
      } else {
        console.log('Waiting for number of statuses to equal ' +
          numStatuses + ' (currently ' + json.stats.status_count + ')...')
      }
    } catch (err) {
      console.log('Waiting for Mastodon API to be available...')
    } finally {
      await new Promise(resolve => setTimeout(resolve, 5000))
    }
  }
  console.log('Mastodon data populated')
}

if (esMain(import.meta)) {
  waitForMastodonData().catch(err => {
    console.error(err)
    process.exit(1)
  })
}
