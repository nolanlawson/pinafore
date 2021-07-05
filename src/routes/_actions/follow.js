import { store } from '../_store/store.js'
import { followAccount, unfollowAccount } from '../_api/follow.js'
import { toast } from '../_components/toast/toast.js'
import { updateLocalRelationship } from './accounts.js'
import { formatIntl } from '../_utils/formatIntl.js'

export async function setAccountFollowed (accountId, follow, toastOnSuccess) {
  const { currentInstance, accessToken } = store.get()
  try {
    let relationship
    if (follow) {
      relationship = await followAccount(currentInstance, accessToken, accountId)
    } else {
      relationship = await unfollowAccount(currentInstance, accessToken, accountId)
    }
    await updateLocalRelationship(currentInstance, accountId, relationship)
    if (toastOnSuccess) {
      /* no await */ toast.say(follow ? 'intl.followedAccount' : 'intl.unfollowedAccount')
    }
  } catch (e) {
    console.error(e)
    /* no await */ toast.say(follow
      ? formatIntl('intl.unableToFollow', { error: (e.message || '') })
      : formatIntl('intl.unableToUnfollow', { error: (e.message || '') })
    )
  }
}
