import { actions } from './mastodon-data'
import { users } from '../tests/users'
import { postStatus } from '../routes/_api/statuses'
import { followAccount } from '../routes/_api/follow'
import { favoriteStatus } from '../routes/_api/favorite'
import { reblogStatus } from '../routes/_api/reblog'
import fetch from 'node-fetch'
import bluebird from 'bluebird'
import FileApi from 'file-api'
import path from 'path'
import fs from 'fs'
import FormData from 'form-data'
import { auth } from '../routes/_api/utils'
import { pinStatus } from '../routes/_api/pin'

fetch.Promise = bluebird
bluebird.longStackTraces()

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

async function sequential (promiseFactories) {
  for (let promiseFactory of promiseFactories) {
    await promiseFactory()
  }
}

export async function restoreMastodonData () {
  console.log('Restoring mastodon data...')
  let internalIdsToIds = {}

  async function doAction (action) {
    console.log(JSON.stringify(action))
    let accessToken = users[action.user].accessToken

    if (action.post) {
      let { text, media, sensitive, spoiler, privacy, inReplyTo, internalId } = action.post
      if (inReplyTo) {
        inReplyTo = internalIdsToIds[inReplyTo].id
      }
      let mediaIds = media && await Promise.all(media.map(async mediaItem => {
        let mediaResponse = await submitMedia(accessToken, mediaItem, 'kitten')
        return mediaResponse.id
      }))
      let status = await postStatus('localhost:3000', accessToken, text, inReplyTo, mediaIds,
        sensitive, spoiler, privacy || 'public')
      if (internalId) {
        internalIdsToIds[internalId] = status.id
      }
    } else if (action.follow) {
      return followAccount('localhost:3000', accessToken, users[action.follow].id)
    } else if (action.favorite) {
      return favoriteStatus('localhost:3000', accessToken,
        internalIdsToIds[action.favorite].id
      )
    } else if (action.boost) {
      return reblogStatus('localhost:3000', accessToken,
        internalIdsToIds[action.boost].id
      )
    } else if (action.pin) {
      return pinStatus('localhost:3000', accessToken,
        internalIdsToIds[action.pin].id
      )
    }
  }

  const posts = actions.filter(action => action.post && !action.post.inReplyTo)
  const replies = actions.filter(action => action.post && action.post.inReplyTo)
  const interactions = actions.filter(action => !action.post)

  await sequential(posts.map(_ => () => doAction(_)))
  await sequential(replies.map(_ => () => doAction(_)))

  for (let interaction of interactions) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    await doAction(interaction)
  }

  console.log('Restored mastodon data')
}
