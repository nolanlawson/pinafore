import { store } from '../_store/store.js'
import { muteAccount, unmuteAccount } from '../_api/mute.js'
import { toast } from '../_components/toast/toast.js'
import { updateLocalRelationship } from './accounts.js'
import { emit } from '../_utils/eventBus.js'
import { formatIntl } from '../_utils/formatIntl.js'

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
