import { store } from '../_store/store'
import { getTimeline } from '../_api/timelines'
import { toast } from '../_utils/toast'
import { mark, stop } from '../_utils/marks'
import { mergeArrays } from '../_utils/arrays'
import { byItemIds } from '../_utils/sorting'
import isEqual from 'lodash-es/isEqual'
import {
  insertTimelineItems as insertTimelineItemsInDatabase
} from '../_database/timelines/insertion'
import {
  getTimeline as getTimelineFromDatabase
} from '../_database/timelines/pagination'

const FETCH_LIMIT = 20

async function fetchTimelineItems (instanceName, accessToken, timelineName, lastTimelineItemId, online) {
  mark('fetchTimelineItems')
  let items
  let stale = false
  if (!online) {
    items = await getTimelineFromDatabase(instanceName, timelineName, lastTimelineItemId, FETCH_LIMIT)
    stale = true
  } else {
    try {
      items = await getTimeline(instanceName, accessToken, timelineName, lastTimelineItemId, FETCH_LIMIT)
      /* no await */ insertTimelineItemsInDatabase(instanceName, timelineName, items)
    } catch (e) {
      console.error(e)
      toast.say('Internet request failed. Showing offline content.')
      items = await getTimelineFromDatabase(instanceName, timelineName, lastTimelineItemId, FETCH_LIMIT)
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
    store.setForTimeline(instanceName, timelineName, {timelineItemIds: mergedIds})
  }
  if (oldStale !== newStale) {
    store.setForTimeline(instanceName, timelineName, {timelineItemIdsAreStale: newStale})
  }
}

async function fetchTimelineItemsAndPossiblyFallBack () {
  mark('fetchTimelineItemsAndPossiblyFallBack')
  let timelineName = store.get('currentTimeline')
  let instanceName = store.get('currentInstance')
  let accessToken = store.get('accessToken')
  let lastTimelineItemId = store.get('lastTimelineItemId')
  let online = store.get('online')

  let { items, stale } = await fetchTimelineItems(instanceName, accessToken, timelineName, lastTimelineItemId, online)
  addTimelineItems(instanceName, timelineName, items, stale)
  stop('fetchTimelineItemsAndPossiblyFallBack')
}

export async function setupTimeline () {
  mark('setupTimeline')
  // If we don't have any item ids, or if the current item ids are stale
  // (i.e. via offline mode), then we need to re-fetch
  // Also do this if it's a thread, because threads change pretty frequently and
  // we don't have a good way to update them.

  let timelineItemIds = store.get('timelineItemIds')
  let timelineItemIdsAreStale = store.get('timelineItemIdsAreStale')
  let currentTimeline = store.get('currentTimeline')
  if (!timelineItemIds ||
      timelineItemIdsAreStale ||
      currentTimeline.startsWith('status/')) {
    await fetchTimelineItemsAndPossiblyFallBack()
  }
  stop('setupTimeline')
}

export async function fetchTimelineItemsOnScrollToBottom (instanceName, timelineName) {
  store.setForTimeline(instanceName, timelineName, { runningUpdate: true })
  await fetchTimelineItemsAndPossiblyFallBack()
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
  return showMoreItemsForTimeline(
    store.get('currentInstance'),
    store.get('currentTimeline')
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
