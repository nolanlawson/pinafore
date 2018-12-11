import { store } from '../_store/store'
import { setShowReblogs as setShowReblogsApi } from '../_api/showReblogs'
import { toast } from '../_utils/toast'
import { updateLocalRelationship } from './accounts'

export async function setShowReblogs (accountId, showReblogs, toastOnSuccess) {
  let { currentInstance, accessToken } = store.get()
  try {
    let relationship = await setShowReblogsApi(currentInstance, accessToken, accountId, showReblogs)
    await updateLocalRelationship(currentInstance, accountId, relationship)
    if (toastOnSuccess) {
      if (showReblogs) {
        toast.say('Showing boosts')
      } else {
        toast.say('Hiding boosts')
      }
    }
  } catch (e) {
    console.error(e)
    toast.say(`Unable to ${showReblogs ? 'show' : 'hide'} boosts: ` + (e.message || ''))
  }
}
