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
}

export function createMakeProps (instanceName, timelineType, timelineValue) {
  let promiseChain = Promise.resolve()

  tryInitBlurhash() // start the blurhash worker a bit early to save time

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

  async function getStatusOrNotification (itemId) {
    const statusOrNotification = await fetchFromIndexedDB(itemId)
    await decodeAllBlurhashes(statusOrNotification)
    return statusOrNotification
  }

  // The results from IndexedDB or the worker thread can return in random order,
  // so we ensure consistent ordering based on the order this function is called in.
  return itemId => {
    const getStatusOrNotificationPromise = getStatusOrNotification(itemId) // start the promise ASAP
    return new Promise((resolve, reject) => {
      promiseChain = promiseChain
        .then(() => getStatusOrNotificationPromise)
        .then(resolve, reject)
    })
  }
}
