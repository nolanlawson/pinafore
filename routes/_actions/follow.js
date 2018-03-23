import { store } from '../_store/store'
import { followAccount, unfollowAccount } from '../_api/follow'
import { database } from '../_database/database'
import { toast } from '../_utils/toast'
import { updateProfileAndRelationship } from './accounts'

export async function setAccountFollowed (accountId, follow, toastOnSuccess) {
  let instanceName = store.get('currentInstance')
  let accessToken = store.get('accessToken')
  try {
    let account
    if (follow) {
      account = await followAccount(instanceName, accessToken, accountId)
    } else {
      account = await unfollowAccount(instanceName, accessToken, accountId)
    }
    // TODO: hack to let the animation fully play
    await new Promise(resolve => setTimeout(resolve, 400))
    await updateProfileAndRelationship(accountId)
    let relationship = await database.getRelationship(instanceName, accountId)
    if (toastOnSuccess) {
      if (follow) {
        if (account.locked && relationship.requested) {
          toast.say('Requested to follow account')
        } else {
          toast.say('Followed account')
        }
      } else {
        toast.say('Unfollowed account')
      }
    }
  } catch (e) {
    console.error(e)
    toast.say(`Unable to ${follow ? 'follow' : 'unfollow'} account: ` + (e.message || ''))
  }
}
