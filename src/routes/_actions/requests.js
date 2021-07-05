import { store } from '../_store/store.js'
import { approveFollowRequest, rejectFollowRequest } from '../_api/requests.js'
import { emit } from '../_utils/eventBus.js'
import { toast } from '../_components/toast/toast.js'
import { formatIntl } from '../_utils/formatIntl.js'

export async function setFollowRequestApprovedOrRejected (accountId, approved, toastOnSuccess) {
  const {
    currentInstance,
    accessToken
  } = store.get()
  try {
    if (approved) {
      await approveFollowRequest(currentInstance, accessToken, accountId)
    } else {
      await rejectFollowRequest(currentInstance, accessToken, accountId)
    }
    if (toastOnSuccess) {
      /* no await */ toast.say(approved ? 'intl.approvedFollowRequest' : 'intl.rejectedFollowRequest')
    }
    emit('refreshAccountsList')
  } catch (e) {
    console.error(e)
    /* no await */ toast.say(approved
      ? formatIntl('intl.unableToApproveFollowRequest', { error: (e.message || '') })
      : formatIntl('intl.unableToRejectFollowRequest', { error: (e.message || '') })
    )
  }
}
