import { store } from '../_store/store'
import { blockAccount, unblockAccount } from '../_api/block'
import { toast } from '../_utils/toast'
import { updateLocalRelationship } from './accounts'
import { emit } from '../_utils/eventBus'

export async function setAccountBlocked (accountId, block, toastOnSuccess) {
  let { currentInstance, accessToken } = store.get()
  try {
    let relationship
    if (block) {
      relationship = await blockAccount(currentInstance, accessToken, accountId)
    } else {
      relationship = await unblockAccount(currentInstance, accessToken, accountId)
    }
    await updateLocalRelationship(currentInstance, accountId, relationship)
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
