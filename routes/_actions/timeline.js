import { store } from '../_store/store'
import { database } from '../_utils/database/database'
import { getTimeline } from '../_utils/mastodon/timelines'
import { toast } from '../_utils/toast'
import { StatusStream } from '../_utils/mastodon/StatusStream'
import { getInstanceInfo } from '../_utils/mastodon/instance'
import { mark, stop } from '../_utils/marks'
import { mergeArrays } from '../_utils/arrays'

const FETCH_LIMIT = 20

let statusStream

async function fetchStatuses(instanceName, accessToken, timelineName, lastStatusId, online) {
  mark('fetchStatuses')
  let statuses
  if (!online) {
    statuses = await database.getTimeline(instanceName, timelineName, lastStatusId, FETCH_LIMIT)
  } else {
    try {
      statuses = await getTimeline(instanceName, accessToken, timelineName, lastStatusId, FETCH_LIMIT)
      /* no await */ database.insertStatuses(instanceName, timelineName, statuses)
    } catch (e) {
      console.error(e)
      toast.say('Internet request failed. Showing offline content.')
      statuses = await database.getTimeline(instanceName, timelineName, lastStatusId, FETCH_LIMIT)
    }
  }
  stop('fetchStatuses')
  return statuses
}

async function addStatuses(instanceName, timelineName, newStatuses) {
  console.log('addStatuses, length:', newStatuses.length)
  mark('addStatuses')
  let newStatusIds = newStatuses.map(status => status.id)
  let oldStatusIds = store.getForTimeline(instanceName, timelineName, 'statusIds') || []
  let merged = mergeArrays(oldStatusIds, newStatusIds)
  store.setForTimeline(instanceName, timelineName, {
    statusIds: merged,
    // if it's a status (context) list, we need to scroll to the status in question
    scrollToStatusId: timelineName.startsWith('status/') && timelineName.split('/').slice(-1)[0]
  })
  stop('addStatuses')
}

async function fetchStatusesAndPossiblyFallBack() {
  mark('fetchStatusesAndPossiblyFallBack')
  let timelineName = store.get('currentTimeline')
  let instanceName = store.get('currentInstance')
  let accessToken = store.get('accessToken')
  let lastStatusId = store.get('lastStatusId')
  let online = store.get('online')

  let newStatuses = await fetchStatuses(instanceName, accessToken, timelineName, lastStatusId, online)
  addStatuses(instanceName, timelineName, newStatuses)
  stop('fetchStatusesAndPossiblyFallBack')
}

export function initializeTimeline() {
  mark('initializeTimeline')
  let instanceName = store.get('currentInstance')
  let timeline = store.get('currentTimeline')
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      store.setForTimeline(instanceName, timeline, {initialized: true})
    })
  })
  stop('initializeTimeline')
}

export async function setupTimeline() {
  mark('addStatuses')
  let timelineName = store.get('currentTimeline')
  let instanceName = store.get('currentInstance')
  let accessToken = store.get('accessToken')
  if (!store.get('statusIds').length) {
    await fetchStatusesAndPossiblyFallBack()
  }
  /* no await */ getInstanceInfo(instanceName).then(instanceInfo => database.setInstanceInfo(instanceName, instanceInfo))
  let instanceInfo = await database.getInstanceInfo(instanceName)
  if (statusStream) {
    statusStream.close()
  }
  statusStream = new StatusStream(instanceInfo.urls.streaming_api, accessToken, timelineName, {
    onMessage(message) {
      console.log('message', message)
    }
  })
  stop('addStatuses')
}

export async function fetchStatusesOnScrollToBottom() {
  let timelineName = store.get('currentTimeline')
  let instanceName = store.get('currentInstance')
  store.setForTimeline(instanceName, timelineName, { runningUpdate: true })
  await fetchStatusesAndPossiblyFallBack()
  store.setForTimeline(instanceName, timelineName, { runningUpdate: false })
}