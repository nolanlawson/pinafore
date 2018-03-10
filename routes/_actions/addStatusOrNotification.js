import throttle from 'lodash/throttle'
import { getIdsThatTheseStatusesReblogged } from './statuses'
import { database } from '../_database/database'
import { mark, stop } from '../_utils/marks'
import { store } from '../_store/store'
import { scheduleIdleTask } from '../_utils/scheduleIdleTask'

async function getExistingItemIdsSet (instanceName, timelineName) {
  let timelineItemIds = store.getForTimeline(instanceName, timelineName, 'timelineItemIds') || []
  if (timelineName === 'notifications') {
    return new Set(timelineItemIds)
  }
  let reblogIds = await getIdsThatTheseStatusesReblogged(instanceName, timelineItemIds)
  return new Set([].concat(timelineItemIds).concat(reblogIds))
}

async function removeDuplicates (instanceName, timelineName, updates) {
  // remove duplicates, including duplicates due to reblogs
  let existingItemIds = await getExistingItemIdsSet(instanceName, timelineName)
  return updates.filter(update => !existingItemIds.has(update.id))
}

async function insertUpdatesIntoTimeline (instanceName, timelineName, updates) {
  updates = await removeDuplicates(instanceName, timelineName, updates)

  await database.insertTimelineItems(instanceName, timelineName, updates)

  let itemIdsToAdd = store.getForTimeline(instanceName, timelineName, 'itemIdsToAdd') || []
  if (updates && updates.length) {
    itemIdsToAdd = itemIdsToAdd.concat(updates.map(_ => _.id))
    console.log('adding ', itemIdsToAdd.length, 'items to itemIdsToAdd')
    store.setForTimeline(instanceName, timelineName, {itemIdsToAdd: itemIdsToAdd})
  }
}

async function insertUpdatesIntoThreads (instanceName, updates) {
  if (!updates.length) {
    return
  }

  let threads = store.getThreadsForTimeline(instanceName)

  for (let timelineName of Object.keys(threads)) {
    let thread = threads[timelineName]
    let updatesForThisThread = updates.filter(status => {
      return thread.includes(status.in_reply_to_id) && !thread.includes(status.id)
    })
    let itemIdsToAdd = store.getForTimeline(instanceName, timelineName, 'itemIdsToAdd') || []
    for (let update of updatesForThisThread) {
      if (!itemIdsToAdd.includes(update.id)) {
        itemIdsToAdd.push(update.id)
      }
    }
    console.log('adding ', itemIdsToAdd.length, 'items to itemIdsToAdd for thread', timelineName)
    store.setForTimeline(instanceName, timelineName, {itemIdsToAdd: itemIdsToAdd})
    console.log('timelineName', timelineName, 'itemIdsToAdd', itemIdsToAdd)
  }
}

async function processFreshUpdates (instanceName, timelineName) {
  mark('processFreshUpdates')
  let freshUpdates = store.getForTimeline(instanceName, timelineName, 'freshUpdates')
  if (freshUpdates && freshUpdates.length) {
    let updates = freshUpdates.slice()
    store.setForTimeline(instanceName, timelineName, {freshUpdates: []})

    await insertUpdatesIntoTimeline(instanceName, timelineName, updates)
    await insertUpdatesIntoThreads(instanceName, updates.filter(status => status.in_reply_to_id))
  }
  stop('processFreshUpdates')
}

const lazilyProcessFreshUpdates = throttle((instanceName, timelineName) => {
  scheduleIdleTask(() => {
    /* no await */ processFreshUpdates(instanceName, timelineName)
  })
}, 5000)

export function addStatusOrNotification (instanceName, timelineName, newStatusOrNotification) {
  let freshUpdates = store.getForTimeline(instanceName, timelineName, 'freshUpdates') || []
  freshUpdates.push(newStatusOrNotification)
  store.setForTimeline(instanceName, timelineName, {freshUpdates: freshUpdates})
  lazilyProcessFreshUpdates(instanceName, timelineName)
}
