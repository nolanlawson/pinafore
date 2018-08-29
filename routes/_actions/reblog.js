import { store } from '../_store/store'
import { toast } from '../_utils/toast'
import { reblogStatus, unreblogStatus } from '../_api/reblog'
import { setStatusReblogged as setStatusRebloggedInDatabase } from '../_database/timelines/updateStatus'
import { emit } from '../_utils/eventBus'

export async function setReblogged (statusId, reblogged) {
  let online = store.get()
  if (!online) {
    toast.say(`You cannot ${reblogged ? 'boost' : 'unboost'} while offline.`)
    return
  }
  let { currentInstance, accessToken } = store.get()
  let networkPromise = reblogged
    ? reblogStatus(currentInstance, accessToken, statusId)
    : unreblogStatus(currentInstance, accessToken, statusId)
  emit('statusUpdated', statusId, _ => Object.assign({}, _, {reblogged: reblogged})) // optimistic update
  try {
    await networkPromise
    await setStatusRebloggedInDatabase(currentInstance, statusId, reblogged)
  } catch (e) {
    console.error(e)
    toast.say(`Failed to ${reblogged ? 'boost' : 'unboost'}. ` + (e.message || ''))
    emit('statusUpdated', statusId, _ => Object.assign({}, _, {reblogged: !reblogged})) // undo optimistic update
  }
}
