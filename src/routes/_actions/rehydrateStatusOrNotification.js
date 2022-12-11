import { get } from '../_utils/lodash-lite.js'
import { mark, stop } from '../_utils/marks.js'
import { decode as decodeBlurhash, init as initBlurhash } from '../_utils/blurhash.js'
import { scheduleIdleTask } from '../_utils/scheduleIdleTask.js'
import { statusHtmlToPlainText } from '../_utils/statusHtmlToPlainText.js'

function getActualStatus (statusOrNotification) {
  return get(statusOrNotification, ['status']) ||
    get(statusOrNotification, ['notification', 'status'])
}

export function prepareToRehydrate () {
  // start the blurhash worker a bit early to save time
  try {
    initBlurhash()
  } catch (err) {
    console.error('could not start blurhash worker', err)
  }
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

// Do stuff that we need to do when the status or notification is fetched from the database,
// like calculating the blurhash or calculating the plain text content
export async function rehydrateStatusOrNotification (statusOrNotification) {
  await Promise.all([
    decodeAllBlurhashes(statusOrNotification),
    calculatePlainTextContent(statusOrNotification)
  ])
}
