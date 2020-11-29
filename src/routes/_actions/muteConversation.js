import { store } from '../_store/store'
import { muteConversation, unmuteConversation } from '../_api/muteConversation'
import { toast } from '../_components/toast/toast'
import { database } from '../_database/database'
import { formatIntl } from '../_utils/formatIntl'

export async function setConversationMuted (statusId, mute, toastOnSuccess) {
  const { currentInstance, accessToken } = store.get()
  try {
    if (mute) {
      await muteConversation(currentInstance, accessToken, statusId)
    } else {
      await unmuteConversation(currentInstance, accessToken, statusId)
    }
    await database.setStatusMuted(currentInstance, statusId, mute)
    if (toastOnSuccess) {
      /* no await */ toast.say(mute ? 'intl.mutedConversation' : 'intl.unmutedConversation')
    }
  } catch (e) {
    console.error(e)
    /* no await */ toast.say(mute
      ? formatIntl('intl.unableToMuteConversation', { error: (e.message || '') })
      : formatIntl('intl.unableToUnmuteConversation', { error: (e.message || '') })
    )
  }
}
