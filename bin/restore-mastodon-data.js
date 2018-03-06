import { actions } from './mastodon-data'
import { users } from '../tests/users'
import { pinStatus, postStatus } from '../routes/_api/statuses'
import { followAccount } from '../routes/_api/follow'
import { favoriteStatus } from '../routes/_api/favorite'
import { reblogStatus } from '../routes/_api/reblog'
import fetch from 'node-fetch'
import FileApi from 'file-api'
import path from 'path'
import fs from 'fs'
import FormData from 'form-data'
import { auth } from '../routes/_api/utils'

global.File = FileApi.File
global.FormData = FileApi.FormData
global.fetch = fetch

async function submitMedia(accessToken, filename, alt) {
  let form = new FormData()
  form.append('file', fs.createReadStream(path.join(__dirname, '../tests/images/' + filename)))
  form.append('description', alt)
  return new Promise((resolve, reject) => {
    form.submit({
      host: 'localhost',
      port: 3000,
      path: '/api/v1/media',
      headers: auth(accessToken)
    }, (err, res) => {
      if (err) {
        return reject(err)
      }
      let data = ''

      res.on('data', chunk => {
        data += chunk
      })

      res.on('end', () => resolve(JSON.parse(data)))
    })
  })
}

export async function restoreMastodonData () {
  console.log('Restoring mastodon data...')
  let internalIdsToIds = {}
  for (let action of actions) {
    console.log(JSON.stringify(action))
    let accessToken = users[action.user].accessToken
    if (action.post) {
      let { text, media, sensitive, spoiler, privacy, inReplyTo, internalId } = action.post
      if (typeof inReplyTo !== 'undefined') {
        inReplyTo = internalIdsToIds[inReplyTo]
      }
      let mediaIds = media && await Promise.all(media.map(async mediaItem => {
        let mediaResponse = await submitMedia(accessToken, mediaItem, 'kitten')
        return mediaResponse.id
      }))
      let status = await postStatus('localhost:3000', accessToken, text, inReplyTo, mediaIds,
        sensitive, spoiler, privacy || 'public')
      if (typeof internalId !== 'undefined') {
        internalIdsToIds[internalId] = status.id
      }
    } else if (action.follow) {
      await followAccount('localhost:3000', accessToken, users[action.follow].id)
    } else if (action.favorite) {
      await favoriteStatus('localhost:3000', accessToken, internalIdsToIds[action.favorite])
    } else if (action.boost) {
      await reblogStatus('localhost:3000', accessToken, internalIdsToIds[action.boost])
    } else if (action.pin) {
      await pinStatus('localhost:3000', accessToken, internalIdsToIds[action.pin])
    }
    await new Promise(resolve => setTimeout(resolve, 1500))
  }
  console.log('Restored mastodon data')
}