import { store } from '../_store/store'
import { followAccount, unfollowAccount } from '../_api/follow'
import { toast } from '../_utils/toast'
import { updateProfileAndRelationship } from './accounts'

export async function setAccountFollowed (accountId, follow, toastOnSuccess) {
  let { currentInstance, accessToken } = store.get()
  try {
    if (follow) {
      await followAccount(currentInstance, accessToken, accountId)
    } else {
      await unfollowAccount(currentInstance, accessToken, accountId)
    }
    await updateProfileAndRelationship(accountId)
    if (toastOnSuccess) {
      if (follow) {
        toast.say('Followed account')
      } else {
        toast.say('Unfollowed account')
      }
    }
  } catch (e) {
    console.error(e)
    toast.say(`Unable to ${follow ? 'follow' : 'unfollow'} account: ` + (e.message || ''))
  }
}
