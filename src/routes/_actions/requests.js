import { store } from '../_store/store'
import { approveFollowRequest, rejectFollowRequest } from '../_api/requests'
import { emit } from '../_utils/eventBus'
import { toast } from '../_utils/toast'

export async function setFollowRequestApprovedOrRejected (accountId, approved, toastOnSuccess) {
  let {
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
      if (approved) {
        toast.say('Approved follow request')
      } else {
        toast.say('Rejected follow request')
      }
    }
    emit('refreshAccountsList')
  } catch (e) {
    console.error(e)
    toast.say(`Unable to ${approved ? 'approve' : 'reject'} account: ` + (e.message || ''))
  }
}
