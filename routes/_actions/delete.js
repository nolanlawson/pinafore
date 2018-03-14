import { store } from '../_store/store'
import { deleteStatus } from '../_api/delete'
import { toast } from '../_utils/toast'

export async function doDeleteStatus (statusId) {
  let instanceName = store.get('currentInstance')
  let accessToken = store.get('accessToken')
  try {
    await deleteStatus(instanceName, accessToken, statusId)
    toast.say('Status deleted.')
  } catch (e) {
    console.error(e)
    toast.say('Unable to delete status: ' + (e.message || ''))
  }
}
