import { store } from '../_store/store'
import { blockAccount, unblockAccount } from '../_api/block'
import { toast } from '../_components/toast/toast'
import { updateLocalRelationship } from './accounts'
import { emit } from '../_utils/eventBus'
import { formatIntl } from '../_utils/formatIntl'

export async function setAccountBlocked (accountId, block, toastOnSuccess) {
  const { currentInstance, accessToken } = store.get()
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
        /* no await */ toast.say('intl.blockedAccount')
      } else {
        /* no await */ toast.say('intl.unblockedAccount')
      }
    }
    emit('refreshAccountsList')
  } catch (e) {
    console.error(e)
    /* no await */ toast.say(block
      ? formatIntl('intl.unableToBlock', { block: !!block, error: (e.message || '') })
      : formatIntl('intl.unableToUnblock', { error: (e.message || '') })
    )
  }
}
