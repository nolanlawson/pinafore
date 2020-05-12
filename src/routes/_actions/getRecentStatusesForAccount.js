import { store } from '../_store/store'
import { getTimeline } from '../_api/timelines/timelines'
import {TIMELINE_BATCH_SIZE} from "../_static/timelines";

export async function getRecentStatusesForAccount (accountId) {
  const { currentInstance, accessToken } = store.get()
  return getTimeline(currentInstance, accessToken, `account/${accountId}`, null, null, TIMELINE_BATCH_SIZE)
}
