import { store } from '../_store/store'
import { approveFollowRequest, rejectFollowRequest } from '../_api/requests'
import { emit } from '../_utils/eventBus'
import { toast } from '../_components/toast/toast'
import { formatIntl } from '../_utils/formatIntl'

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
