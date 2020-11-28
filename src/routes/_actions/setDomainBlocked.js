import { store } from '../_store/store'
import { blockDomain, unblockDomain } from '../_api/blockDomain'
import { toast } from '../_components/toast/toast'
import { updateRelationship } from './accounts'
import { formatIntl } from '../_utils/formatIntl'

export async function setDomainBlocked (accountId, domain, block, toastOnSuccess) {
  const { currentInstance, accessToken } = store.get()
  try {
    if (block) {
      await blockDomain(currentInstance, accessToken, domain)
    } else {
      await unblockDomain(currentInstance, accessToken, domain)
    }
    await updateRelationship(accountId)
    if (toastOnSuccess) {
      /* no await */ toast.say(block ? 'intl.hidDomain' : 'intl.unhidDomain')
    }
  } catch (e) {
    console.error(e)
    /* no await */ toast.say(block
      ? formatIntl('intl.unableToHideDomain', { error: (e.message || '') })
      : formatIntl('intl.unableToUnhideDomain', { error: (e.message || '') })
    )
  }
}
