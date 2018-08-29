import { store } from '../_store/store'
import { toast } from '../_utils/toast'
import { reblogStatus, unreblogStatus } from '../_api/reblog'
import { database } from '../_database/database'

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
  store.setStatusReblogged(currentInstance, statusId, reblogged) // optimistic update
  try {
    await networkPromise
    await database.setStatusReblogged(currentInstance, statusId, reblogged)
  } catch (e) {
    console.error(e)
    toast.say(`Failed to ${reblogged ? 'boost' : 'unboost'}. ` + (e.message || ''))
    store.setStatusReblogged(currentInstance, statusId, !reblogged) // undo optimistic update
  }
}
