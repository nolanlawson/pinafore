import { store } from '../_store/store'
import { toast } from '../_components/toast/toast'
import { postStatus as postStatusToServer } from '../_api/statuses'
import { addStatusOrNotification } from './addStatusOrNotification'
import { database } from '../_database/database'
import { emit } from '../_utils/eventBus'
import { putMediaMetadata } from '../_api/media'

export async function insertHandleForReply (statusId) {
  let { currentInstance } = store.get()
  let status = await database.getStatus(currentInstance, statusId)
  let { currentVerifyCredentials } = store.get()
  let originalStatus = status.reblog || status
  let accounts = [originalStatus.account].concat(originalStatus.mentions || [])
    .filter(account => account.id !== currentVerifyCredentials.id)
  if (!store.getComposeData(statusId, 'text') && accounts.length) {
    store.setComposeData(statusId, {
      text: accounts.map(account => `@${account.acct} `).join('')
    })
  }
}

export async function postStatus (realm, text, inReplyToId, mediaIds,
  sensitive, spoilerText, visibility,
  mediaDescriptions, inReplyToUuid, poll, mediaFocalPoints) {
  let { currentInstance, accessToken, online } = store.get()

  if (!online) {
    toast.say('You cannot post while offline')
    return
  }

  text = text || ''

  let mediaMetadata = (mediaIds || []).map((mediaId, idx) => {
    return {
      description: mediaDescriptions && mediaDescriptions[idx],
      focalPoint: mediaFocalPoints && mediaFocalPoints[idx]
    }
  })

  store.set({ postingStatus: true })
  try {
    await Promise.all(mediaMetadata.map(async ({ description, focalPoint }, i) => {
      description = description || ''
      focalPoint = focalPoint || [0, 0]
      focalPoint[0] = focalPoint[0] || 0
      focalPoint[1] = focalPoint[1] || 0
      if (description || focalPoint[0] || focalPoint[1]) {
        return putMediaMetadata(currentInstance, accessToken, mediaIds[i], description, focalPoint)
      }
    }))
    let status = await postStatusToServer(currentInstance, accessToken, text,
      inReplyToId, mediaIds, sensitive, spoilerText, visibility, poll, mediaFocalPoints)
    addStatusOrNotification(currentInstance, 'home', status)
    store.clearComposeData(realm)
    emit('postedStatus', realm, inReplyToUuid)
  } catch (e) {
    console.error(e)
    toast.say('Unable to post status: ' + (e.message || ''))
  } finally {
    store.set({ postingStatus: false })
  }
}

export function setReplySpoiler (realm, spoiler) {
  let contentWarning = store.getComposeData(realm, 'contentWarning')
  let contentWarningShown = store.getComposeData(realm, 'contentWarningShown')
  if (typeof contentWarningShown !== 'undefined' || contentWarning) {
    return // user has already interacted with the CW
  }
  store.setComposeData(realm, {
    contentWarning: spoiler,
    contentWarningShown: true
  })
}

const PRIVACY_LEVEL = {
  'direct': 1,
  'private': 2,
  'unlisted': 3,
  'public': 4
}

export function setReplyVisibility (realm, replyVisibility) {
  // return the most private between the user's preferred default privacy
  // and the privacy of the status they're replying to
  let postPrivacy = store.getComposeData(realm, 'postPrivacy')
  if (typeof postPrivacy !== 'undefined') {
    return // user has already set the postPrivacy
  }
  let { currentVerifyCredentials } = store.get()
  let defaultVisibility = currentVerifyCredentials.source.privacy
  let visibility = PRIVACY_LEVEL[replyVisibility] < PRIVACY_LEVEL[defaultVisibility]
    ? replyVisibility
    : defaultVisibility
  store.setComposeData(realm, { postPrivacy: visibility })
}
