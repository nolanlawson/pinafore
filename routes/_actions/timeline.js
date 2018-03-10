import { store } from '../_store/store'
import { database } from '../_database/database'
import { getTimeline } from '../_api/timelines'
import { toast } from '../_utils/toast'
import { mark, stop } from '../_utils/marks'
import { mergeArrays } from '../_utils/arrays'
import { byItemIds } from '../_utils/sorting'

const FETCH_LIMIT = 20

async function fetchTimelineItems (instanceName, accessToken, timelineName, lastTimelineItemId, online) {
  mark('fetchTimelineItems')
  let items
  if (!online) {
    items = await database.getTimeline(instanceName, timelineName, lastTimelineItemId, FETCH_LIMIT)
  } else {
    try {
      items = await getTimeline(instanceName, accessToken, timelineName, lastTimelineItemId, FETCH_LIMIT)
      /* no await */ database.insertTimelineItems(instanceName, timelineName, items)
    } catch (e) {
      console.error(e)
      toast.say('Internet request failed. Showing offline content.')
      items = await database.getTimeline(instanceName, timelineName, lastTimelineItemId, FETCH_LIMIT)
    }
  }
  stop('fetchTimelineItems')
  return items
}

async function addTimelineItems (instanceName, timelineName, newItems) {
  console.log('addTimelineItems, length:', newItems.length)
  mark('addTimelineItems')
  let newIds = newItems.map(item => item.id)
  addTimelineItemIds(instanceName, timelineName, newIds)
  stop('addTimelineItems')
}

export async function addTimelineItemIds (instanceName, timelineName, newIds) {
  let oldIds = store.getForTimeline(instanceName, timelineName, 'timelineItemIds') || []
  let merged = mergeArrays(oldIds, newIds)
  store.setForTimeline(instanceName, timelineName, { timelineItemIds: merged })
}

async function fetchTimelineItemsAndPossiblyFallBack () {
  mark('fetchTimelineItemsAndPossiblyFallBack')
  let timelineName = store.get('currentTimeline')
  let instanceName = store.get('currentInstance')
  let accessToken = store.get('accessToken')
  let lastTimelineItemId = store.get('lastTimelineItemId')
  let online = store.get('online')

  let newItems = await fetchTimelineItems(instanceName, accessToken, timelineName, lastTimelineItemId, online)
  addTimelineItems(instanceName, timelineName, newItems)
  stop('fetchTimelineItemsAndPossiblyFallBack')
}

export function initializeTimeline () {
  mark('initializeTimeline')
  let instanceName = store.get('currentInstance')
  let timeline = store.get('currentTimeline')
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      console.log('initialized')
      store.setForTimeline(instanceName, timeline, {initialized: true})
    })
  })
  stop('initializeTimeline')
}

export async function setupTimeline () {
  mark('setupTimeline')
  if (!store.get('timelineItemIds')) {
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
  addTimelineItemIds(instanceName, timelineName, itemIdsToAdd)
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
