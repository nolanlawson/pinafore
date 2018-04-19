import { store } from '../_store/store'
import { deleteStatus } from '../_api/delete'
import { toast } from '../_utils/toast'

export async function doDeleteStatus (statusId) {
  let { currentInstance, accessToken } = store.get()
  try {
    await deleteStatus(currentInstance, accessToken, statusId)
    toast.say('Status deleted.')
  } catch (e) {
    console.error(e)
    toast.say('Unable to delete status: ' + (e.message || ''))
  }
}
