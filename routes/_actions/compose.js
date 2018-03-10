import { store } from '../_store/store'
import { toast } from '../_utils/toast'
import { postStatus as postStatusToServer } from '../_api/statuses'
import { addStatusOrNotification } from './addStatusOrNotification'
import { database } from '../_database/database'

export async function insertHandleForReply (statusId) {
  let instanceName = store.get('currentInstance')
  let status = await database.getStatus(instanceName, statusId)
  let verifyCredentials = store.get('currentVerifyCredentials')
  let originalStatus = status.reblog || status
  let accounts = [originalStatus.account].concat(originalStatus.mentions || [])
    .filter(account => account.id !== verifyCredentials.id)
  if (!store.getComposeData(statusId, 'text') && accounts.length) {
    store.setComposeData(statusId, {
      text: accounts.map(account => `@${account.acct} `).join('')
    })
  }
}

export async function postStatus (realm, text, inReplyToId, mediaIds,
                                  sensitive, spoilerText, visibility) {
  let instanceName = store.get('currentInstance')
  let accessToken = store.get('accessToken')
  let online = store.get('online')

  if (!online) {
    toast.say('You cannot post while offline')
    return
  }

  store.set({
    postingStatus: true,
    postedStatusForRealm: null
  })
  try {
    let status = await postStatusToServer(instanceName, accessToken, text,
      inReplyToId, mediaIds, sensitive, spoilerText, visibility)
    addStatusOrNotification(instanceName, 'home', status)
    store.clearComposeData(realm)
    store.set({
      postedStatusForRealm: realm
    })
  } catch (e) {
    toast.say('Unable to post status: ' + (e.message || ''))
  } finally {
    store.set({postingStatus: false})
  }
}
