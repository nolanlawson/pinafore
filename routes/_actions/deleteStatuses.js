import { getIdsThatRebloggedThisStatus, getNotificationIdsForStatuses } from './statuses'
import { store } from '../_store/store'
import { scheduleIdleTask } from '../_utils/scheduleIdleTask'
import { database } from '../_database/database'
import forEach from 'lodash/forEach'

function deleteStatusIdsFromStore (instanceName, idsToDelete) {
  let idsToDeleteSet = new Set(idsToDelete)
  let idWasNotDeleted = id => !idsToDeleteSet.has(id)

  let timelinesToTimelineItemIds = store.getAllTimelineData(instanceName, 'timelineItemIds')

  forEach(timelinesToTimelineItemIds, (timelineItemIds, timelineName) => {
    store.setForTimeline(instanceName, timelineName, {
      timelineItemIds: timelineItemIds.filter(idWasNotDeleted)
    })
  })

  let timelinesToItemIdsToAdd = store.getAllTimelineData(instanceName, 'itemIdsToAdd')

  forEach(timelinesToItemIdsToAdd, (itemIdsToAdd, timelineName) => {
    store.setForTimeline(instanceName, timelineName, {
      itemIdsToAdd: itemIdsToAdd.filter(idWasNotDeleted)
    })
  })
}

async function deleteStatusesAndNotifications (instanceName, statusIdsToDelete, notificationIdsToDelete) {
  deleteStatusIdsFromStore(instanceName, statusIdsToDelete)
  await database.deleteStatusesAndNotifications(instanceName, statusIdsToDelete, notificationIdsToDelete)
}

async function doDeleteStatus (instanceName, statusId) {
  console.log('deleting statusId', statusId)
  let rebloggedIds = await getIdsThatRebloggedThisStatus(instanceName, statusId)
  let statusIdsToDelete = Array.from(new Set([statusId].concat(rebloggedIds).filter(Boolean)))
  let notificationIdsToDelete = new Set(await getNotificationIdsForStatuses(instanceName, statusIdsToDelete))
  await deleteStatusesAndNotifications(instanceName, statusIdsToDelete, notificationIdsToDelete)
}

export function deleteStatus (instanceName, statusId) {
  scheduleIdleTask(() => {
    /* no await */ doDeleteStatus(instanceName, statusId)
  })
}
