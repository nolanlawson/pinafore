import { store } from '../_store/store'
import { blockAccount, unblockAccount } from '../_api/block'
import { toast } from '../_utils/toast'
import { updateProfileAndRelationship } from './accounts'
import { emit } from '../_utils/eventBus'

export async function setAccountBlocked (accountId, block, toastOnSuccess) {
  let { currentInstance, accessToken } = store.get()
  try {
    if (block) {
      await blockAccount(currentInstance, accessToken, accountId)
    } else {
      await unblockAccount(currentInstance, accessToken, accountId)
    }
    await updateProfileAndRelationship(accountId)
    if (toastOnSuccess) {
      if (block) {
        toast.say('Blocked account')
      } else {
        toast.say('Unblocked account')
      }
    }
    emit('refreshAccountsList')
  } catch (e) {
    console.error(e)
    toast.say(`Unable to ${block ? 'block' : 'unblock'} account: ` + (e.message || ''))
  }
}
