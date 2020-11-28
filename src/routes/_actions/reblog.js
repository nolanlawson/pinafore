import { store } from '../_store/store'
import { toast } from '../_components/toast/toast'
import { reblogStatus, unreblogStatus } from '../_api/reblog'
import { database } from '../_database/database'
import { formatIntl } from '../_utils/formatIntl'

export async function setReblogged (statusId, reblogged) {
  const online = store.get()
  if (!online) {
    /* no await */ toast.say(reblogged ? 'intl.cannotReblogOffline' : 'intl.cannotUnreblogOffline')
    return
  }
  const { currentInstance, accessToken } = store.get()
  const networkPromise = reblogged
    ? reblogStatus(currentInstance, accessToken, statusId)
    : unreblogStatus(currentInstance, accessToken, statusId)
  store.setStatusReblogged(currentInstance, statusId, reblogged) // optimistic update
  try {
    await networkPromise
    await database.setStatusReblogged(currentInstance, statusId, reblogged)
  } catch (e) {
    console.error(e)
    /* no await */ toast.say(reblogged
      ? formatIntl('intl.failedToReblog', { error: (e.message || '') })
      : formatIntl('intl.failedToUnreblog', { error: (e.message || '') })
    )
    store.setStatusReblogged(currentInstance, statusId, !reblogged) // undo optimistic update
  }
}
