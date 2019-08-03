import { database } from '../_database/database'

export async function getIdThatThisStatusReblogged (instanceName, statusId) {
  const status = await database.getStatus(instanceName, statusId)
  return status.reblog && status.reblog.id
}

export async function getIdsThatTheseStatusesReblogged (instanceName, statusIds) {
  const reblogIds = await Promise.all(statusIds.map(async statusId => {
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
