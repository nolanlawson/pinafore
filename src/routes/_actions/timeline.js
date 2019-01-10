import { registerDefaultInstance } from './addInstance'
import { store } from '../_store/store'
import { getTimeline } from '../_api/timelines'
import { toast } from '../_components/toast/toast'
import { mark, stop } from '../_utils/marks'
import { concat, mergeArrays } from '../_utils/arrays'
import { byItemIds } from '../_utils/sorting'
import isEqual from 'lodash-es/isEqual'
import { database } from '../_database/database'
import { getStatus, getStatusContext } from '../_api/statuses'
import { emit } from '../_utils/eventBus'
import { TIMELINE_BATCH_SIZE } from '../_static/timelines'

async function storeFreshTimelineItemsInDatabase (instanceName, timelineName, items) {
  await database.insertTimelineItems(instanceName, timelineName, items)
  if (timelineName.startsWith('status/')) {
    // For status threads, we want to be sure to update the favorite/reblog counts even if
    // this is a stale "view" of the status. See 119-status-counts-update.js for
    // an example of why we need this.
    items.forEach(item => {
      emit('statusUpdated', item)
    })
  }
}

async function fetchTimelineItemsFromNetwork (instanceName, accessToken, timelineName, lastTimelineItemId) {
  if (timelineName.startsWith('status/')) { // special case - this is a list of descendents and ancestors
    let statusId = timelineName.split('/').slice(-1)[0]
    let statusRequest = getStatus(instanceName, accessToken, statusId)
    let contextRequest = getStatusContext(instanceName, accessToken, statusId)
    let [ status, context ] = await Promise.all([statusRequest, contextRequest])
    return concat(context.ancestors, status, context.descendants)
  } else { // normal timeline
    return getTimeline(instanceName, accessToken, timelineName, lastTimelineItemId, null, TIMELINE_BATCH_SIZE)
  }
}

async function fetchTimelineItems (instanceName, accessToken, timelineName, lastTimelineItemId, online) {
  mark('fetchTimelineItems')
  let items
  let stale = false
  if (!online) {
    items = await database.getTimeline(instanceName, timelineName, lastTimelineItemId, TIMELINE_BATCH_SIZE)
    stale = true
  } else {
    try {
      console.log('fetchTimelineItemsFromNetwork')
      items = await fetchTimelineItemsFromNetwork(instanceName, accessToken, timelineName, lastTimelineItemId)
      /* no await */ storeFreshTimelineItemsInDatabase(instanceName, timelineName, items)
    } catch (e) {
      console.error(e)
      toast.say('Internet request failed. Showing offline content.')
      items = await database.getTimeline(instanceName, timelineName, lastTimelineItemId, TIMELINE_BATCH_SIZE)
      stale = true
    }
  }
  stop('fetchTimelineItems')
  return { items, stale }
}

async function addTimelineItems (instanceName, timelineName, items, stale) {
  console.log('addTimelineItems, length:', items.length)
  mark('addTimelineItems')
  let newIds = items.map(item => item.id)
  addTimelineItemIds(instanceName, timelineName, newIds, stale)
  stop('addTimelineItems')
}

export async function addTimelineItemIds (instanceName, timelineName, newIds, newStale) {
  let oldIds = store.getForTimeline(instanceName, timelineName, 'timelineItemIds')
  let oldStale = store.getForTimeline(instanceName, timelineName, 'timelineItemIdsAreStale')

  let mergedIds = mergeArrays(oldIds || [], newIds)

  if (!isEqual(oldIds, mergedIds)) {
    store.setForTimeline(instanceName, timelineName, { timelineItemIds: mergedIds })
  }
  if (oldStale !== newStale) {
    store.setForTimeline(instanceName, timelineName, { timelineItemIdsAreStale: newStale })
  }
}

async function fetchTimelineItemsAndPossiblyFallBack () {
  mark('fetchTimelineItemsAndPossiblyFallBack')
  let {
    currentTimeline,
    currentInstance,
    accessToken,
    lastTimelineItemId,
    online
  } = store.get()
  if (currentInstance === undefined || currentInstance === null) {
    currentInstance = await registerDefaultInstance()
  }

  let { items, stale } = await fetchTimelineItems(currentInstance, accessToken, currentTimeline, lastTimelineItemId, online)
  addTimelineItems(currentInstance, currentTimeline, items, stale)
  stop('fetchTimelineItemsAndPossiblyFallBack')
}

export async function setupTimeline () {
  mark('setupTimeline')
  // If we don't have any item ids, or if the current item ids are stale
  // (i.e. via offline mode), then we need to re-fetch
  // Also do this if it's a thread, because threads change pretty frequently and
  // we don't have a good way to update them.
  let {
    timelineItemIds,
    timelineItemIdsAreStale,
    currentTimeline
  } = store.get()
  if (!timelineItemIds ||
      timelineItemIdsAreStale ||
      currentTimeline.startsWith('status/')) {
    await fetchTimelineItemsAndPossiblyFallBack()
  }
  stop('setupTimeline')
}

export async function fetchTimelineItemsOnScrollToBottom (instanceName, timelineName) {
  console.log('setting runningUpdate: true')
  store.setForTimeline(instanceName, timelineName, { runningUpdate: true })
  await fetchTimelineItemsAndPossiblyFallBack()
  console.log('setting runningUpdate: false')
  store.setForTimeline(instanceName, timelineName, { runningUpdate: false })
}

export async function showMoreItemsForTimeline (instanceName, timelineName) {
  mark('showMoreItemsForTimeline')
  let itemIdsToAdd = store.getForTimeline(instanceName, timelineName, 'itemIdsToAdd')
  itemIdsToAdd = itemIdsToAdd.sort(byItemIds).reverse()
  addTimelineItemIds(instanceName, timelineName, itemIdsToAdd, false)
  store.setForTimeline(instanceName, timelineName, {
    itemIdsToAdd: [],
    shouldShowHeader: false,
    showHeader: false
  })
  stop('showMoreItemsForTimeline')
}

export async function showMoreItemsForCurrentTimeline () {
  let { currentInstance, currentTimeline } = store.get()
  return showMoreItemsForTimeline(
    currentInstance,
    currentTimeline
  )
}

export async function showMoreItemsForThread (instanceName, timelineName) {
  mark('showMoreItemsForThread')
  let itemIdsToAdd = store.getForTimeline(instanceName, timelineName, 'itemIdsToAdd')
  let timelineItemIds = store.getForTimeline(instanceName, timelineName, 'timelineItemIds')
  // TODO: update database and do the thread merge correctly
  timelineItemIds = timelineItemIds.concat(itemIdsToAdd)
  store.setForTimeline(instanceName, timelineName, {
    itemIdsToAdd: [],
    timelineItemIds: timelineItemIds
  })
  stop('showMoreItemsForThread')
}
