import { store } from '../_store/store.js'
import { getTimeline } from '../_api/timelines.js'
import { toast } from '../_components/toast/toast.js'
import { mark, stop } from '../_utils/marks.js'
import { concat, mergeArrays } from '../_utils/arrays.js'
import { compareTimelineItemSummaries } from '../_utils/statusIdSorting.js'
import { uniqBy, isEqual } from '../_thirdparty/lodash/objects.js'
import { database } from '../_database/database.js'
import { getStatus, getStatusContext } from '../_api/statuses.js'
import { emit } from '../_utils/eventBus.js'
import { TIMELINE_BATCH_SIZE } from '../_static/timelines.js'
import { timelineItemToSummary } from '../_utils/timelineItemToSummary.js'
import { addStatusesOrNotifications } from './addStatusOrNotification.js'
import { scheduleIdleTask } from '../_utils/scheduleIdleTask.js'
import { sortItemSummariesForThread } from '../_utils/sortItemSummariesForThread.js'
import li from 'li'

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
    const { items } = await getTimeline(instanceName, accessToken, timelineName, lastTimelineItemId, null, TIMELINE_BATCH_SIZE)
    return items
  }
}
async function addPagedTimelineItems (instanceName, timelineName, items) {
  console.log('addPagedTimelineItems, length:', items.length)
  mark('addPagedTimelineItemSummaries')
  const newSummaries = items.map(item => timelineItemToSummary(item, instanceName))
  await addPagedTimelineItemSummaries(instanceName, timelineName, newSummaries)
  stop('addPagedTimelineItemSummaries')
}

export async function addPagedTimelineItemSummaries (instanceName, timelineName, newSummaries) {
  const oldSummaries = store.getForTimeline(instanceName, timelineName, 'timelineItemSummaries')

  const mergedSummaries = uniqBy(concat(oldSummaries || [], newSummaries), byId)

  if (!isEqual(oldSummaries, mergedSummaries)) {
    store.setForTimeline(instanceName, timelineName, { timelineItemSummaries: mergedSummaries })
  }
}

async function fetchPagedItems (instanceName, accessToken, timelineName) {
  const { timelineNextPageId } = store.get()
  console.log('saved timelineNextPageId', timelineNextPageId)
  const { items, headers } = await getTimeline(instanceName, accessToken, timelineName, timelineNextPageId, null, TIMELINE_BATCH_SIZE)
  const linkHeader = headers.get('Link')
  const parsedLinkHeader = li.parse(linkHeader)
  const nextUrl = parsedLinkHeader && parsedLinkHeader.next
  const nextId = nextUrl && (new URL(nextUrl)).searchParams.get('max_id')
  console.log('new timelineNextPageId', nextId)
  store.setForTimeline(instanceName, timelineName, { timelineNextPageId: nextId })
  await storeFreshTimelineItemsInDatabase(instanceName, timelineName, items)
  await addPagedTimelineItems(instanceName, timelineName, items)
}

async function fetchTimelineItems (instanceName, accessToken, timelineName, online) {
  mark('fetchTimelineItems')
  const { lastTimelineItemId } = store.get()
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
      /* no await */ toast.say('intl.showingOfflineContent')
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
  const newSummaries = items.map(item => timelineItemToSummary(item, instanceName))
  addTimelineItemSummaries(instanceName, timelineName, newSummaries, stale)
  stop('addTimelineItemSummaries')
}

export async function addTimelineItemSummaries (instanceName, timelineName, newSummaries, newStale) {
  const oldSummaries = store.getForTimeline(instanceName, timelineName, 'timelineItemSummaries')
  const oldStale = store.getForTimeline(instanceName, timelineName, 'timelineItemSummariesAreStale')

  const mergedSummaries = uniqBy(mergeArrays(oldSummaries || [], newSummaries, compareTimelineItemSummaries), byId)

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
    online
  } = store.get()

  if (currentTimeline === 'favorites' || currentTimeline === 'bookmarks') {
    // Always fetch favorites from the network, we currently don't have a good way of storing
    // these in IndexedDB because of "internal ID" system Mastodon uses to paginate these
    await fetchPagedItems(currentInstance, accessToken, currentTimeline)
  } else {
    const { items, stale } = await fetchTimelineItems(currentInstance, accessToken, currentTimeline, online)
    await addTimelineItems(currentInstance, currentTimeline, items, stale)
  }
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
