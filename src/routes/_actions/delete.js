import { store } from '../_store/store'
import { deleteStatus } from '../_api/delete'
import { toast } from '../_components/toast/toast'
import { deleteStatus as deleteStatusLocally } from './deleteStatuses'

export async function doDeleteStatus (statusId) {
  let { currentInstance, accessToken } = store.get()
  try {
    let deletedStatus = await deleteStatus(currentInstance, accessToken, statusId)
    deleteStatusLocally(currentInstance, statusId)
    toast.say('Status deleted.')
    return deletedStatus
  } catch (e) {
    console.error(e)
    toast.say('Unable to delete status: ' + (e.message || ''))
    return {}
  }
}
