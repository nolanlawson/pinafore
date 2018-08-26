import { store } from '../_store/store'
import { followAccount, unfollowAccount } from '../_api/follow'
import { toast } from '../_utils/toast'
import { updateLocalRelationship } from './accounts'

export async function setAccountFollowed (accountId, follow, toastOnSuccess) {
  let { currentInstance, accessToken } = store.get()
  try {
    let relationship
    if (follow) {
      relationship = await followAccount(currentInstance, accessToken, accountId)
    } else {
      relationship = await unfollowAccount(currentInstance, accessToken, accountId)
    }
    await updateLocalRelationship(currentInstance, accountId, relationship)
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
