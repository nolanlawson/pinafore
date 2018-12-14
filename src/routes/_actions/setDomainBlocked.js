import { store } from '../_store/store.js'
import { blockDomain, unblockDomain } from '../_api/blockDomain.js'
import { toast } from '../_utils/toast.js'
import { updateRelationship } from './accounts.js'

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
