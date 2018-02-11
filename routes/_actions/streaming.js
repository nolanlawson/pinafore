import { TimelineStream } from '../_api/TimelineStream'
import identity from 'lodash/identity'
import { database } from '../_database/database'
import { store } from '../_store/store'
import { scheduleIdleTask } from '../_utils/scheduleIdleTask'

async function removeDuplicates (instanceName, timelineName, updates) {
  // remove duplicates, including duplicates due to reblogs
  let timelineItemIds = store.getForTimeline(instanceName, timelineName, 'timelineItemIds')
  let reblogIds = (await Promise.all(timelineItemIds.map(async timelineItemId => {
    let status = await database.getStatus(instanceName, timelineItemId)
    return status.reblog && status.reblog.id
  }))).filter(identity)
  let existingItemIds = new Set([].concat(timelineItemIds).concat(reblogIds))
  return updates.filter(update => !existingItemIds.has(update.id))
}

async function handleFreshChanges (instanceName, timelineName) {
  console.log('handleFreshChanges')
  let freshChanges = store.getForTimeline(instanceName, timelineName, 'freshChanges')
  console.log('freshChanges', freshChanges)
  if (freshChanges.updates && freshChanges.updates.length) {
    let updates = freshChanges.updates.slice()
    freshChanges.updates = []
    store.setForTimeline(instanceName, timelineName, {freshChanges: freshChanges})

    console.log('before removing duplicates, updates are ', updates.length)
    updates = await removeDuplicates(instanceName, timelineName, updates)
    console.log('after removing duplicates, updates are ', updates.length)

    await database.insertTimelineItems(instanceName, timelineName, updates)

    let itemIdsToAdd = store.getForTimeline(instanceName, timelineName, 'itemIdsToAdd') || []
    itemIdsToAdd = itemIdsToAdd.concat(updates.map(_ => _.id))
    store.setForTimeline(instanceName, timelineName, {itemIdsToAdd: itemIdsToAdd})
  }
}

function handleStreamMessage (instanceName, timelineName, message) {
  console.log('handleStreamMessage')
  let { event, payload } = message
  let key = event === 'update' ? 'updates' : 'deletes'
  let freshChanges = store.getForTimeline(instanceName, timelineName, 'freshChanges') || {}
  freshChanges[key] = freshChanges[key] || []
  freshChanges[key].push(JSON.parse(payload))
  store.setForTimeline(instanceName, timelineName, {freshChanges: freshChanges})
  scheduleIdleTask(() => {
    handleFreshChanges(instanceName, timelineName)
  })
}

export function createStream (streamingApi, instanceName, accessToken, timelineName) {
  return new TimelineStream(streamingApi, accessToken, timelineName, {
    onMessage (msg) {
      console.log('message', msg)
      if (msg.event !== 'update' && msg.event !== 'delete') {
        console.error("don't know how to handle event", msg)
        return
      }
      scheduleIdleTask(() => {
        handleStreamMessage(instanceName, timelineName, msg)
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
