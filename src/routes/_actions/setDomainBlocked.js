import { store } from '../_store/store'
import { blockDomain, unblockDomain } from '../_api/blockDomain'
import { toast } from '../_utils/toast'
import { updateRelationship } from './accounts'

export async function setDomainBlocked (accountId, domain, block, toastOnSuccess) {
  let { currentInstance, accessToken } = store.get()
  try {
    if (block) {
      await blockDomain(currentInstance, accessToken, domain)
    } else {
      await unblockDomain(currentInstance, accessToken, domain)
    }
    await updateRelationship(accountId)
    if (toastOnSuccess) {
      if (block) {
        toast.say(`Hiding ${domain}`)
      } else {
        toast.say(`Unhiding ${domain}`)
      }
    }
  } catch (e) {
    console.error(e)
    toast.say(`Unable to ${block ? 'hide' : 'unhide'} domain: ` + (e.message || ''))
  }
}
