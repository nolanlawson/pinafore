import { store } from '../_store/store'
import { database } from '../_database/database'
import { toast } from '../_utils/toast'
import { reblogStatus, unreblogStatus } from '../_api/reblog'

export async function setReblogged (statusId, reblogged) {
  if (!store.get('online')) {
    toast.say(`You cannot ${reblogged ? 'boost' : 'unboost'} while offline.`)
    return
  }
  let instanceName = store.get('currentInstance')
  let accessToken = store.get('accessToken')
  let networkPromise = reblogged
    ? reblogStatus(instanceName, accessToken, statusId)
    : unreblogStatus(instanceName, accessToken, statusId)
  store.setStatusReblogged(instanceName, statusId, reblogged) // optimistic update
  try {
    await networkPromise
    await database.setStatusReblogged(instanceName, statusId, reblogged)
  } catch (e) {
    console.error(e)
    toast.say(`Failed to ${reblogged ? 'boost' : 'unboost'}. ` + (e.message || ''))
    store.setStatusReblogged(instanceName, statusId, !reblogged) // undo optimistic update
  }
}
