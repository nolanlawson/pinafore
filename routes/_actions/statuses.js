import {
  getNotificationIdsForStatuses as getNotificationIdsForStatusesFromDatabase,
  getReblogsForStatus as getReblogsForStatusFromDatabase
} from '../_database/timelines/lookup'
import {
  getStatus as getStatusFromDatabase
} from '../_database/timelines/getStatusOrNotification'

export async function getIdThatThisStatusReblogged (instanceName, statusId) {
  let status = await getStatusFromDatabase(instanceName, statusId)
  return status.reblog && status.reblog.id
}

export async function getIdsThatTheseStatusesReblogged (instanceName, statusIds) {
  let reblogIds = await Promise.all(statusIds.map(async statusId => {
    return getIdThatThisStatusReblogged(instanceName, statusId)
  }))
  return reblogIds.filter(Boolean)
}

export async function getIdsThatRebloggedThisStatus (instanceName, statusId) {
  return getReblogsForStatusFromDatabase(instanceName, statusId)
}

export async function getNotificationIdsForStatuses (instanceName, statusIds) {
  return getNotificationIdsForStatusesFromDatabase(instanceName, statusIds)
}
