import { TimelineStream } from '../_api/TimelineStream'
import identity from 'lodash/identity'
import { database } from '../_database/database'
import { store } from '../_store/store'
import { scheduleIdleTask } from '../_utils/scheduleIdleTask'
import throttle from 'lodash/throttle'
import { mark, stop } from '../_utils/marks'

async function getReblogIds(instanceName, statusIds) {
  let reblogIds = await Promise.all(statusIds.map(async timelineItemId => {
    let status = await database.getStatus(instanceName, timelineItemId)
    return status.reblog && status.reblog.id
  }))
  return reblogIds.filter(identity)
}

async function getExistingItemIdsSet(instanceName, timelineName) {
  let timelineItemIds = store.getForTimeline(instanceName, timelineName, 'timelineItemIds') || []
  if (timelineName === 'notifications') {
    return new Set(timelineItemIds)
  }
  let reblogIds = await getReblogIds(instanceName, timelineItemIds)
  return new Set([].concat(timelineItemIds).concat(reblogIds))
}

async function removeDuplicates (instanceName, timelineName, updates) {
  // remove duplicates, including duplicates due to reblogs
  let existingItemIds = await getExistingItemIdsSet(instanceName, timelineName)
  return updates.filter(update => !existingItemIds.has(update.id))
}

async function processFreshUpdates (instanceName, timelineName) {
  mark('processFreshUpdates')
  let freshUpdates = store.getForTimeline(instanceName, timelineName, 'freshUpdates')
  if (freshUpdates && freshUpdates.length) {
    let updates = freshUpdates.slice()
    store.setForTimeline(instanceName, timelineName, {freshUpdates: []})

    updates = await removeDuplicates(instanceName, timelineName, updates)

    await database.insertTimelineItems(instanceName, timelineName, updates)

    let itemIdsToAdd = store.getForTimeline(instanceName, timelineName, 'itemIdsToAdd') || []
    if (updates && updates.length) {
      itemIdsToAdd = itemIdsToAdd.concat(updates.map(_ => _.id))
      console.log('adding ', itemIdsToAdd.length, 'items to itemIdsToAdd')
      store.setForTimeline(instanceName, timelineName, {itemIdsToAdd: itemIdsToAdd})
    }
    stop('processFreshUpdates')
  }
}

const lazilyProcessFreshUpdates = throttle((instanceName, timelineName) => {
  scheduleIdleTask(() => {
    /* no await */ processFreshUpdates(instanceName, timelineName)
  })
}, 5000)

function processUpdate(instanceName, timelineName, update) {
  let freshUpdates = store.getForTimeline(instanceName, timelineName, 'freshUpdates') || []
  freshUpdates.push(update)
  store.setForTimeline(instanceName, timelineName, {freshUpdates: freshUpdates})
  lazilyProcessFreshUpdates(instanceName, timelineName)
}

function processDelete(instanceName, deletion) {
  // TODO
}

function processMessage (instanceName, timelineName, message) {
  mark('processMessage')
  let { event, payload } = message
  let parsedPayload = JSON.parse(payload)
  switch (event) {
    case 'delete':
      processDelete(instanceName, parsedPayload)
      break
    case 'update':
      processUpdate(instanceName, timelineName, parsedPayload)
      break
    case 'notification':
      processUpdate(instanceName, 'notifications', parsedPayload)
      break
  }
  stop('processMessage')
}

export function createStream (streamingApi, instanceName, accessToken, timelineName) {
  return new TimelineStream(streamingApi, accessToken, timelineName, {
    onMessage (msg) {
      if (msg.event !== 'update' && msg.event !== 'delete' && msg.event !== 'notification') {
        console.error("don't know how to handle event", msg)
        return
      }
      scheduleIdleTask(() => {
        processMessage(instanceName, timelineName, msg)
      })
    },
    onOpen () {
      console.log('opened stream for timeline', timelineName)
    },
    onClose () {
      console.log('closed stream for timeline', timelineName)
    },
    onReconnect () {
      console.log('reconnected stream for timeline', timelineName)
    }
  })
}
