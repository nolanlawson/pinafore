import { store } from '../_store/store'
import { setShowReblogs as setShowReblogsApi } from '../_api/showReblogs'
import { toast } from '../_components/toast/toast'
import { updateLocalRelationship } from './accounts'

export async function setShowReblogs (accountId, showReblogs, toastOnSuccess) {
  const { currentInstance, accessToken } = store.get()
  try {
    const relationship = await setShowReblogsApi(currentInstance, accessToken, accountId, showReblogs)
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
