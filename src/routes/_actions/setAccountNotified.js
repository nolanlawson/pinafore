import { store } from '../_store/store.js'
import { notifyAccount, denotifyAccount } from '../_api/notify.js'
import { toast } from '../_components/toast/toast.js'
import { updateLocalRelationship } from './accounts.js'
import { formatIntl } from '../_utils/formatIntl.js'

export async function setAccountNotified (accountId, notify, toastOnSuccess) {
  const { currentInstance, accessToken } = store.get()
  try {
    let relationship
    if (notify) {
      relationship = await notifyAccount(currentInstance, accessToken, accountId)
    } else {
      relationship = await denotifyAccount(currentInstance, accessToken, accountId)
    }
    await updateLocalRelationship(currentInstance, accountId, relationship)
    if (toastOnSuccess) {
      /* no await */ toast.say(notify ? 'intl.subscribedAccount' : 'intl.unsubscribedAccount')
    }
  } catch (e) {
    console.error(e)
    /* no await */ toast.say(notify
      ? formatIntl('intl.unableToSubscribe', { error: (e.message || '') })
      : formatIntl('intl.unableToUnsubscribe', { error: (e.message || '') })
    )
  }
}
