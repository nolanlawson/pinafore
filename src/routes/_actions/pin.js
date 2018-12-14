import { store } from '../_store/store.js'
import { toast } from '../_utils/toast.js'
import { pinStatus, unpinStatus } from '../_api/pin.js'
import { database } from '../_database/database.js'
import { emit } from '../_utils/eventBus.js'

export async function setStatusPinnedOrUnpinned (statusId, pinned, toastOnSuccess) {
  let { currentInstance, accessToken } = store.get()
  try {
    if (pinned) {
      await pinStatus(currentInstance, accessToken, statusId)
    } else {
      await unpinStatus(currentInstance, accessToken, statusId)
    }
    if (toastOnSuccess) {
      if (pinned) {
        toast.say('Pinned status')
      } else {
        toast.say('Unpinned status')
      }
    }
    store.setStatusPinned(currentInstance, statusId, pinned)
    await database.setStatusPinned(currentInstance, statusId, pinned)
    emit('updatePinnedStatuses')
  } catch (e) {
    console.error(e)
    toast.say(`Unable to ${pinned ? 'pin' : 'unpin'} status: ` + (e.message || ''))
  }
}
