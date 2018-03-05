import { database } from '../_database/database'
import { store } from '../_store/store'
import { toast } from '../_utils/toast'
import { postStatus as postStatusToServer } from '../_api/statuses'
import { addStatusOrNotification } from './addStatusOrNotification'

export async function getIdThatThisStatusReblogged (instanceName, statusId) {
  let status = await database.getStatus(instanceName, statusId)
  return status.reblog && status.reblog.id
}

export async function getIdsThatTheseStatusesReblogged (instanceName, statusIds) {
  let reblogIds = await Promise.all(statusIds.map(async statusId => {
    return getIdThatThisStatusReblogged(instanceName, statusId)
  }))
  return reblogIds.filter(Boolean)
}

export async function getIdsThatRebloggedThisStatus (instanceName, statusId) {
  return database.getReblogsForStatus(instanceName, statusId)
}

export async function getNotificationIdsForStatuses (instanceName, statusIds) {
  return database.getNotificationIdsForStatuses(instanceName, statusIds)
}

export async function postStatus(realm, text, inReplyToId, mediaIds,
                                 sensitive, spoilerText, visibility) {
  let instanceName = store.get('currentInstance')
  let accessToken = store.get('accessToken')
  let online = store.get('online')

  if (!online) {
    toast.say('You cannot post while offline')
    return
  }

  store.set({postingStatus: true})
  try {
    let status = await postStatusToServer(instanceName, accessToken, text,
      inReplyToId, mediaIds, sensitive, spoilerText, visibility)
    addStatusOrNotification(instanceName, 'home', status)
    store.clearComposeData(realm)
  } catch (e) {
    toast.say('Unable to post status: ' + (e.message || ''))
  } finally {
    store.set({postingStatus: false})
  }
}