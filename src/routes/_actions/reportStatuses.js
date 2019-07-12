import { store } from '../_store/store'
import { toast } from '../_components/toast/toast'
import { report } from '../_api/report'

export async function reportStatuses (account, statusIds, comment, forward) {
  const { currentInstance, accessToken } = store.get()
  try {
    await report(currentInstance, accessToken, account.id, statusIds, comment, forward)
    toast.say('Submitted report')
  } catch (e) {
    toast.say('Failed to report: ' + (e.message || ''))
  }
}
