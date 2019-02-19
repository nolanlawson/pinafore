import { store } from '../_store/store'
import { getTimeline } from '../_api/timelines'

export async function getRecentStatusesForAccount (accountId) {
  const { currentInstance, accessToken } = store.get()
  return getTimeline(currentInstance, accessToken, `account/${accountId}`, null, null, 20)
}
