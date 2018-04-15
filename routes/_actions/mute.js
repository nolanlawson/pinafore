import { store } from '../_store/store'
import { muteAccount, unmuteAccount } from '../_api/mute'
import { toast } from '../_utils/toast'
import { updateProfileAndRelationship } from './accounts'

export async function setAccountMuted (accountId, mute, toastOnSuccess) {
  let instanceName = store.get('currentInstance')
  let accessToken = store.get('accessToken')
  try {
    if (mute) {
      await muteAccount(instanceName, accessToken, accountId)
    } else {
      await unmuteAccount(instanceName, accessToken, accountId)
    }
    await updateProfileAndRelationship(accountId)
    if (toastOnSuccess) {
      if (mute) {
        toast.say('Muted account')
      } else {
        toast.say('Unmuted account')
      }
    }
  } catch (e) {
    console.error(e)
    toast.say(`Unable to ${mute ? 'mute' : 'unmute'} account: ` + (e.message || ''))
  }
}
