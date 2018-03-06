import { actions } from './mastodon-data'
import { users } from '../tests/users'
import { postStatus } from '../routes/_api/statuses'
import { uploadMedia } from '../routes/_api/media'
import { followAccount } from '../routes/_api/follow'
import { favoriteStatus } from '../routes/_api/favorite'
import { reblogStatus } from '../routes/_api/reblog'
import fetch from 'node-fetch'
import FileApi from 'file-api'
import path from 'path'

global.File = FileApi.File
global.FormData = FileApi.FormData
global.fetch = fetch

export async function restoreMastodonData () {
  debugger
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
        let file = new File(path.join(__dirname, '../tests/images/' + mediaItem))
        let mediaResponse = await uploadMedia('localhost:3000', accessToken, file)
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
    }
  }
}