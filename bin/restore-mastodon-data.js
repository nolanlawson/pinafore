import { actions } from './mastodon-data'
import { users } from '../tests/users'
import { postStatus } from '../routes/_api/statuses'
import { followAccount } from '../routes/_api/follow'
import { favoriteStatus } from '../routes/_api/favorite'
import { reblogStatus } from '../routes/_api/reblog'
import fetch from 'node-fetch'
import FileApi from 'file-api'
import path from 'path'
import fs from 'fs'
import FormData from 'form-data'
import { auth } from '../routes/_api/utils'
import { pinStatus } from '../routes/_api/pin'

global.File = FileApi.File
global.FormData = FileApi.FormData
global.fetch = fetch

async function submitMedia (accessToken, filename, alt) {
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
  let internalIdsToPromises = {}

  let sequentialActions = Promise.resolve()
  let postActions = Promise.resolve()

  async function doAction (action) {
    if (action.post) {
      // If the action is a post, then the IDs just have to be unique by timestamp. Delaying by a millisecond
      // is sufficient for this.
      postActions = postActions.then(() => new Promise(resolve => setTimeout(resolve, 100)))
      await postActions
    } else {
      // If the action is a boost, favorite, etc., then it needs to
      // be delayed by a second, otherwise it may appear in an unpredictable order and break the tests.
      sequentialActions = sequentialActions.then(() => new Promise(resolve => setTimeout(resolve, 1000)))
      await sequentialActions
    }
    console.log(JSON.stringify(action))
    let accessToken = users[action.user].accessToken

    if (action.post) {
      let { text, media, sensitive, spoiler, privacy, inReplyTo } = action.post
      if (inReplyTo) {
        inReplyTo = (await internalIdsToPromises[inReplyTo]).id
      }
      let mediaIds = media && await Promise.all(media.map(async mediaItem => {
        let mediaResponse = await submitMedia(accessToken, mediaItem, 'kitten')
        return mediaResponse.id
      }))
      return postStatus('localhost:3000', accessToken, text, inReplyTo, mediaIds,
        sensitive, spoiler, privacy || 'public')
    } else if (action.follow) {
      return followAccount('localhost:3000', accessToken, users[action.follow].id)
    } else if (action.favorite) {
      return favoriteStatus('localhost:3000', accessToken,
        (await internalIdsToPromises[action.favorite]).id
      )
    } else if (action.boost) {
      return reblogStatus('localhost:3000', accessToken,
        (await internalIdsToPromises[action.boost]).id
      )
    } else if (action.pin) {
      return pinStatus('localhost:3000', accessToken,
        (await internalIdsToPromises[action.pin]).id
      )
    }
  }

  await Promise.all(actions.map(action => {
    const promise = doAction(action)
    const internalId = action.post && action.post.internalId
    if (internalId) {
      internalIdsToPromises[internalId] = promise
    }
    return promise
  }))

  console.log('Restored mastodon data')
}
