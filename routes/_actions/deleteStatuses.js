import { getIdsThatRebloggedThisStatus, getIdThatThisStatusReblogged, getNotificationIdsForStatuses } from './statuses'
import { store } from '../_store/store'
import { scheduleIdleTask } from '../_utils/scheduleIdleTask'
import { database } from '../_database/database'

function deleteStatusIdsFromStore (instanceName, idsToDelete) {
  let idsToDeleteSet = new Set(idsToDelete)
  let timelines = store.get('timelines')
  if (timelines && timelines[instanceName]) {
    Object.keys(timelines[instanceName]).forEach(timelineName => {
      let timelineData = timelines[instanceName][timelineName]
      if (timelineName !== 'notifications') {
        timelineData.timelineItemIds = timelineData.timelineItemIds.filter(_ => !idsToDeleteSet.has(_))
        timelineData.itemIdsToAdd = timelineData.itemIdsToAdd.filter(_ => !idsToDeleteSet.has(_))
      }
    })
    store.set({timelines: timelines})
  }
}

async function deleteStatusesAndNotifications (instanceName, statusIdsToDelete, notificationIdsToDelete) {
  deleteStatusIdsFromStore(instanceName, statusIdsToDelete)
  await database.deleteStatusesAndNotifications(instanceName, statusIdsToDelete, notificationIdsToDelete)
}

async function doDeleteStatus (instanceName, statusId) {
  let reblogId = await getIdThatThisStatusReblogged(instanceName, statusId)
  let rebloggedIds = await getIdsThatRebloggedThisStatus(reblogId || statusId)
  let statusIdsToDelete = Array.from(new Set([statusId, reblogId].concat(rebloggedIds).filter(Boolean)))
  let notificationIdsToDelete = new Set(await getNotificationIdsForStatuses(instanceName, statusIdsToDelete))
  await Promise.all([
    deleteStatusesAndNotifications(instanceName, statusIdsToDelete, notificationIdsToDelete)
  ])
}

export function deleteStatus (instanceName, statusId) {
  scheduleIdleTask(() => {
    /* no await */ doDeleteStatus(instanceName, statusId)
  })
}
