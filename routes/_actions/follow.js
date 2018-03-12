import { store } from '../_store/store'
import { followAccount, unfollowAccount } from '../_api/follow'
import { database } from '../_database/database'
import { toast } from '../_utils/toast'

export async function setAccountFollowed (accountId, follow, toastOnSuccess) {
  let instanceName = store.get('currentInstance')
  let accessToken = store.get('accessToken')
  try {
    if (follow) {
      await followAccount(instanceName, accessToken, accountId)
    } else {
      await unfollowAccount(instanceName, accessToken, accountId)
    }
    let relationship = await database.getRelationship(instanceName, accountId)
    relationship.following = follow
    await database.setRelationship(instanceName, relationship)
    if (toastOnSuccess) {
      toast.say(`${follow ? 'Followed' : 'Unfollowed'}`)
    }
  } catch (e) {
    console.error(e)
    toast.say(`Unable to ${follow ? 'follow' : 'unfollow'} account: ` + (e.message || ''))
  }
}
