import { database } from '../_database/database.js'
import { decode as decodeBlurhash, init as initBlurhash } from '../_utils/blurhash.js'
import { mark, stop } from '../_utils/marks.js'
import { get } from '../_utils/lodash-lite.js'
import { statusHtmlToPlainText } from '../_utils/statusHtmlToPlainText.js'
import { scheduleIdleTask } from '../_utils/scheduleIdleTask.js'

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

function getActualStatus (statusOrNotification) {
  return get(statusOrNotification, ['status']) ||
    get(statusOrNotification, ['notification', 'status'])
}

async function decodeAllBlurhashes (statusOrNotification) {
  const status = getActualStatus(statusOrNotification)
  if (!status) {
    return
  }
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

async function calculatePlainTextContent (statusOrNotification) {
  const status = getActualStatus(statusOrNotification)
  if (!status) {
    return
  }
  const originalStatus = status.reblog ? status.reblog : status
  const content = originalStatus.content || ''
  const mentions = originalStatus.mentions || []
  // Calculating the plaintext from the HTML is a non-trivial operation, so we might
  // as well do it in advance, while blurhash is being decoded on the worker thread.
  await new Promise(resolve => {
    scheduleIdleTask(() => {
      originalStatus.plainTextContent = statusHtmlToPlainText(content, mentions)
      resolve()
    })
  })
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
    await Promise.all([
      decodeAllBlurhashes(statusOrNotification),
      calculatePlainTextContent(statusOrNotification)
    ])
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
