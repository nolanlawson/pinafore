import { database } from '../_database/database'
import { decode as decodeBlurhash, init as initBlurhash } from '../_utils/blurhash'
import { mark, stop } from '../_utils/marks'
import { get } from '../_utils/lodash-lite'

async function getNotification (instanceName, timelineType, timelineValue, itemId) {
  return {
    timelineType,
    timelineValue,
    notification: await database.getNotification(instanceName, itemId)
  }
}

async function getStatus (instanceName, timelineType, timelineValue, itemId) {
  return {
    timelineType,
    timelineValue,
    status: await database.getStatus(instanceName, itemId)
  }
}

function tryInitBlurhash () {
  try {
    initBlurhash()
  } catch (err) {
    console.error('could not start blurhash worker', err)
  }
}

async function decodeAllBlurhashes (statusOrNotification) {
  const status = statusOrNotification.status || statusOrNotification.notification.status
  const mediaWithBlurhashes = get(status, ['media_attachments'], [])
    .concat(get(status, ['reblog', 'media_attachments'], []))
    .filter(_ => _.blurhash)
  if (mediaWithBlurhashes.length) {
    mark(`decodeBlurhash-${status.id}`)
    await Promise.all(mediaWithBlurhashes.map(async media => {
      try {
        media.decodedBlurhash = await decodeBlurhash(media.blurhash)
      } catch (err) {
        console.warn('Could not decode blurhash, ignoring', err)
      }
    }))
    stop(`decodeBlurhash-${status.id}`)
  }
  return statusOrNotification
}

export function createMakeProps (instanceName, timelineType, timelineValue) {
  let taskCount = 0
  let pending = []

  tryInitBlurhash() // start the blurhash worker a bit early to save time

  // The worker-powered indexeddb promises can resolve in arbitrary order,
  // causing the timeline to load in a jerky way. With this function, we
  // wait for all promises to resolve before resolving them all in one go.
  function awaitAllTasksComplete () {
    return new Promise(resolve => {
      taskCount--
      pending.push(resolve)
      if (taskCount === 0) {
        pending.forEach(_ => _())
        pending = []
      }
    })
  }

  async function fetchFromIndexedDB (itemId) {
    mark(`fetchFromIndexedDB-${itemId}`)
    try {
      const res = await (timelineType === 'notifications'
        ? getNotification(instanceName, timelineType, timelineValue, itemId)
        : getStatus(instanceName, timelineType, timelineValue, itemId))
      return res
    } finally {
      stop(`fetchFromIndexedDB-${itemId}`)
    }
  }

  return (itemId) => {
    taskCount++

    return fetchFromIndexedDB(itemId)
      .then(decodeAllBlurhashes)
      .then(statusOrNotification => {
        return awaitAllTasksComplete().then(() => statusOrNotification)
      })
  }
}
