import { store } from '../_store/store'
import { blockAccount, unblockAccount } from '../_api/block'
import { toast } from '../_utils/toast'
import { updateProfileAndRelationship } from './accounts'

export async function setAccountBlocked (accountId, block, toastOnSuccess) {
  let instanceName = store.get('currentInstance')
  let accessToken = store.get('accessToken')
  try {
    if (block) {
      await blockAccount(instanceName, accessToken, accountId)
    } else {
      await unblockAccount(instanceName, accessToken, accountId)
    }
    await updateProfileAndRelationship(accountId)
    if (toastOnSuccess) {
      if (block) {
        toast.say('Blocked account')
      } else {
        toast.say('Unblocked account')
      }
    }
  } catch (e) {
    console.error(e)
    toast.say(`Unable to ${block ? 'block' : 'unblock'} account: ` + (e.message || ''))
  }
}
