import { store } from '../_store/store.js'
import { muteConversation, unmuteConversation } from '../_api/muteConversation.js'
import { toast } from '../_utils/toast.js'
import { database } from '../_database/database.js'

export async function setConversationMuted (statusId, mute, toastOnSuccess) {
  let { currentInstance, accessToken } = store.get()
  try {
    if (mute) {
      await muteConversation(currentInstance, accessToken, statusId)
    } else {
      await unmuteConversation(currentInstance, accessToken, statusId)
    }
    await database.setStatusMuted(currentInstance, statusId, mute)
    if (toastOnSuccess) {
      if (mute) {
        toast.say('Muted conversation')
      } else {
        toast.say('Unmuted conversation')
      }
    }
  } catch (e) {
    console.error(e)
    toast.say(`Unable to ${mute ? 'mute' : 'unmute'} conversation: ` + (e.message || ''))
  }
}
