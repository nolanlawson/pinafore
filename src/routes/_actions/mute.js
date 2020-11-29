import { store } from '../_store/store'
import { muteAccount, unmuteAccount } from '../_api/mute'
import { toast } from '../_components/toast/toast'
import { updateLocalRelationship } from './accounts'
import { emit } from '../_utils/eventBus'
import { formatIntl } from '../_utils/formatIntl'

export async function setAccountMuted (accountId, mute, notifications, toastOnSuccess) {
  const { currentInstance, accessToken } = store.get()
  try {
    let relationship
    if (mute) {
      relationship = await muteAccount(currentInstance, accessToken, accountId, notifications)
    } else {
      relationship = await unmuteAccount(currentInstance, accessToken, accountId)
    }
    await updateLocalRelationship(currentInstance, accountId, relationship)
    if (toastOnSuccess) {
      /* no await */ toast.say(mute ? 'intl.mutedAccount' : 'intl.unmutedAccount')
    }
    emit('refreshAccountsList')
  } catch (e) {
    console.error(e)
    /* no await */ toast.say(mute
      ? formatIntl('intl.unableToMute', { error: (e.message || '') })
      : formatIntl('intl.unableToUnmute', { error: (e.message || '') })
    )
  }
}
