import { store } from '../_store/store.js'
import { deleteStatus } from '../_api/delete.js'
import { toast } from '../_utils/toast.js'
import { deleteStatus as deleteStatusLocally } from './deleteStatuses.js'

export async function doDeleteStatus (statusId) {
  let { currentInstance, accessToken } = store.get()
  try {
    await deleteStatus(currentInstance, accessToken, statusId)
    deleteStatusLocally(currentInstance, statusId)
    toast.say('Status deleted.')
  } catch (e) {
    console.error(e)
    toast.say('Unable to delete status: ' + (e.message || ''))
  }
}
