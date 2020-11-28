import { store } from '../_store/store'
import { toast } from '../_components/toast/toast'
import { report } from '../_api/report'
import { formatIntl } from '../_utils/formatIntl'

export async function reportStatuses (account, statusIds, comment, forward) {
  const { currentInstance, accessToken } = store.get()
  try {
    await report(currentInstance, accessToken, account.id, statusIds, comment, forward)
    /* no await */ toast.say('intl.submittedReport')
  } catch (e) {
    /* no await */ toast.say(formatIntl('intl.failedToReport', { error: (e.message || '') }))
  }
}
