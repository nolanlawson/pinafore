import { store } from '../_store/store'
import { deleteStatus } from '../_api/delete'
import { toast } from '../_components/toast/toast'
import { deleteStatus as deleteStatusLocally } from './deleteStatuses'
import { formatIntl } from '../_utils/formatIntl'

export async function doDeleteStatus (statusId) {
  const { currentInstance, accessToken } = store.get()
  try {
    const deletedStatus = await deleteStatus(currentInstance, accessToken, statusId)
    deleteStatusLocally(currentInstance, statusId)
    /* no await */ toast.say('intl.statusDeleted')
    return deletedStatus
  } catch (e) {
    console.error(e)
    /* no await */ toast.say(formatIntl('intl.unableToDelete', { error: (e.message || '') }))
    throw e
  }
}
