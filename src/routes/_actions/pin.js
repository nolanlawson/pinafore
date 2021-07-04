import { store } from '../_store/store.js'
import { toast } from '../_components/toast/toast.js'
import { pinStatus, unpinStatus } from '../_api/pin.js'
import { database } from '../_database/database.js'
import { emit } from '../_utils/eventBus.js'
import { formatIntl } from '../_utils/formatIntl.js'

export async function setStatusPinnedOrUnpinned (statusId, pinned, toastOnSuccess) {
  const { currentInstance, accessToken } = store.get()
  try {
    if (pinned) {
      await pinStatus(currentInstance, accessToken, statusId)
    } else {
      await unpinStatus(currentInstance, accessToken, statusId)
    }
    if (toastOnSuccess) {
      /* no await */ toast.say(pinned ? 'intl.pinnedStatus' : 'intl.unpinnedStatus')
    }
    store.setStatusPinned(currentInstance, statusId, pinned)
    await database.setStatusPinned(currentInstance, statusId, pinned)
    emit('updatePinnedStatuses')
  } catch (e) {
    console.error(e)
    /* no await */ toast.say(pinned
      ? formatIntl('intl.unableToPinStatus', { error: (e.message || '') })
      : formatIntl('intl.unableToUnpinStatus', { error: (e.message || '') })
    )
  }
}
