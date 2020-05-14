import { store } from '../_store/store'
import { getTimeline } from '../_api/timelines'
import { toast } from '../_components/toast/toast'
import { mark, stop } from '../_utils/marks'
import { concat, mergeArrays } from '../_utils/arrays'
import { compareTimelineItemSummaries } from '../_utils/statusIdSorting'
import isEqual from 'lodash-es/isEqual'
import { database } from '../_database/database'
import { getStatus, getStatusContext } from '../_api/statuses'
import { emit } from '../_utils/eventBus'
import { TIMELINE_BATCH_SIZE } from '../_static/timelines'
import { timelineItemToSummary } from '../_utils/timelineItemToSummary'
import uniqBy from 'lodash-es/uniqBy'
import { addStatusesOrNotifications } from './addStatusOrNotification'
import { scheduleIdleTask } from '../_utils/scheduleIdleTask'
import { sortItemSummariesForThread } from '../_utils/sortItemSummariesForThread'

const byId = _ => _.id

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

async function updateStatus (instanceName, accessToken, statusId) {
  const status = await getStatus(instanceName, accessToken, statusId)
  await database.insertStatus(instanceName, status)
  emit('statusUpdated', status)
  return status
}

async function updateStatusAndThread (instanceName, accessToken, timelineName, statusId) {
  const [status, context] = await Promise.all([
    updateStatus(instanceName, accessToken, statusId),
    getStatusContext(instanceName, accessToken, statusId)
  ])
  await database.insertTimelineItems(
    instanceName,
    timelineName,
    concat(context.ancestors, status, context.descendants)
  )
  addStatusesOrNotifications(instanceName, timelineName, concat(context.ancestors, context.descendants))
}

async function fetchFreshThreadFromNetwork (instanceName, accessToken, statusId) {
  const [status, context] = await Promise.all([
    getStatus(instanceName, accessToken, statusId),
    getStatusContext(instanceName, accessToken, statusId)
  ])
  return concat(context.ancestors, status, context.descendants)
}

async function fetchThreadFromNetwork (instanceName, accessToken, timelineName) {
  const statusId = timelineName.split('/').slice(-1)[0]

  // For threads, we do several optimizations to make it a bit faster to load.
  // The vast majority of statuses have no replies and aren't in reply to anything,
  // so we want that to be as fast as possible.
  const status = await database.getStatus(instanceName, statusId)
  if (!status) {
    // If for whatever reason the status is not cached, fetch everything from the network
    // and wait for the result. This happens in very unlikely cases (e.g. loading /statuses/<id>
    // where <id> is not cached locally) but is worth covering.
    return fetchFreshThreadFromNetwork(instanceName, accessToken, statusId)
  }

  if (!status.in_reply_to_id) {
    // status is not a reply to another status (fast path)
    // Update the status and thread asynchronously, but return just the status for now
    // Any replies to the status will load asynchronously
    /* no await */ updateStatusAndThread(instanceName, accessToken, timelineName, statusId)
    return [status]
  }
  // status is a reply to some other status, meaning we don't want some
  // jerky behavior where it suddenly scrolls into place. Update the status asynchronously
  // but grab the thread now
  scheduleIdleTask(() => updateStatus(instanceName, accessToken, statusId))
  const context = await getStatusContext(instanceName, accessToken, statusId)
  return concat(context.ancestors, status, context.descendants)
}

async function fetchTimelineItemsFromNetwork (instanceName, accessToken, timelineName, lastTimelineItemId) {
  if (timelineName.startsWith('status/')) { // special case - this is a list of descendents and ancestors
    return fetchThreadFromNetwork(instanceName, accessToken, timelineName)
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
      await storeFreshTimelineItemsInDatabase(instanceName, timelineName, items)
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
  mark('addTimelineItemSummaries')
  const newSummaries = items.map(timelineItemToSummary)
  addTimelineItemSummaries(instanceName, timelineName, newSummaries, stale)
  stop('addTimelineItemSummaries')
}

export async function addTimelineItemSummaries (instanceName, timelineName, newSummaries, newStale) {
  const oldSummaries = store.getForTimeline(instanceName, timelineName, 'timelineItemSummaries') || []
  const oldStale = store.getForTimeline(instanceName, timelineName, 'timelineItemSummariesAreStale')

  const mergedSummaries = uniqBy(mergeArrays(oldSummaries, newSummaries, compareTimelineItemSummaries), byId)

  if (!isEqual(oldSummaries, mergedSummaries)) {
    store.setForTimeline(instanceName, timelineName, { timelineItemSummaries: mergedSummaries })
  }
  if (oldStale !== newStale) {
    store.setForTimeline(instanceName, timelineName, { timelineItemSummariesAreStale: newStale })
  }
}

async function fetchTimelineItemsAndPossiblyFallBack () {
  console.log('fetchTimelineItemsAndPossiblyFallBack')
  mark('fetchTimelineItemsAndPossiblyFallBack')
  const {
    currentTimeline,
    currentInstance,
    accessToken,
    lastTimelineItemId,
    online
  } = store.get()

  const { items, stale } = await fetchTimelineItems(currentInstance, accessToken, currentTimeline, lastTimelineItemId, online)
  addTimelineItems(currentInstance, currentTimeline, items, stale)
  stop('fetchTimelineItemsAndPossiblyFallBack')
}

export async function setupTimeline () {
  console.log('setupTimeline')
  mark('setupTimeline')
  // If we don't have any item summaries, or if the current item summaries are stale
  // (i.e. via offline mode), then we need to re-fetch
  // Also do this if it's a thread, because threads change pretty frequently and
  // we don't have a good way to update them.
  const {
    timelineItemSummaries,
    timelineItemSummariesAreStale,
    currentTimeline
  } = store.get()
  console.log({ timelineItemSummaries, timelineItemSummariesAreStale, currentTimeline })
  if (!timelineItemSummaries ||
      timelineItemSummariesAreStale ||
      currentTimeline.startsWith('status/')) {
    await fetchTimelineItemsAndPossiblyFallBack()
  }
  stop('setupTimeline')
}

export async function fetchMoreItemsAtBottomOfTimeline (instanceName, timelineName) {
  console.log('setting runningUpdate: true')
  store.setForTimeline(instanceName, timelineName, { runningUpdate: true })
  await fetchTimelineItemsAndPossiblyFallBack()
  console.log('setting runningUpdate: false')
  store.setForTimeline(instanceName, timelineName, { runningUpdate: false })
}

export async function showMoreItemsForTimeline (instanceName, timelineName) {
  mark('showMoreItemsForTimeline')
  let itemSummariesToAdd = store.getForTimeline(instanceName, timelineName, 'timelineItemSummariesToAdd') || []
  itemSummariesToAdd = itemSummariesToAdd.sort(compareTimelineItemSummaries).reverse()
  addTimelineItemSummaries(instanceName, timelineName, itemSummariesToAdd, false)
  store.setForTimeline(instanceName, timelineName, {
    timelineItemSummariesToAdd: [],
    shouldShowHeader: false,
    showHeader: false
  })
  stop('showMoreItemsForTimeline')
}

export function showMoreItemsForCurrentTimeline () {
  const { currentInstance, currentTimeline } = store.get()
  return showMoreItemsForTimeline(
    currentInstance,
    currentTimeline
  )
}

export async function showMoreItemsForThread (instanceName, timelineName) {
  mark('showMoreItemsForThread')
  const itemSummariesToAdd = store.getForTimeline(instanceName, timelineName, 'timelineItemSummariesToAdd')
  const timelineItemSummaries = store.getForTimeline(instanceName, timelineName, 'timelineItemSummaries')
  const timelineItemIds = new Set(timelineItemSummaries.map(_ => _.id))
  // TODO: update database and do the thread merge correctly
  for (const itemSummaryToAdd of itemSummariesToAdd) {
    if (!timelineItemIds.has(itemSummaryToAdd.id)) {
      timelineItemSummaries.push(itemSummaryToAdd)
    }
  }
  const statusId = timelineName.split('/').slice(-1)[0]
  const sortedTimelineItemSummaries = await sortItemSummariesForThread(timelineItemSummaries, statusId)
  store.setForTimeline(instanceName, timelineName, {
    timelineItemSummariesToAdd: [],
    timelineItemSummaries: sortedTimelineItemSummaries
  })
  stop('showMoreItemsForThread')
}
