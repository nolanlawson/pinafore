import { store } from '../_store/store'
import { cacheFirstUpdateAfter } from '../_utils/sync'
import {
  getPinnedStatuses as getPinnedStatusesFromDatabase,
  insertPinnedStatuses as insertPinnedStatusesInDatabase
} from '../_database/timelines/pinnedStatuses'
import {
  getPinnedStatuses
} from '../_api/pinnedStatuses'

export async function updatePinnedStatusesForAccount (accountId) {
  let currentInstance = store.get('currentInstance')
  let accessToken = store.get('accessToken')

  await cacheFirstUpdateAfter(
    () => getPinnedStatuses(currentInstance, accessToken, accountId),
    () => getPinnedStatusesFromDatabase(currentInstance, accountId),
    statuses => insertPinnedStatusesInDatabase(currentInstance, accountId, statuses),
    statuses => {
      let $pinnedStatuses = store.get('pinnedStatuses')
      $pinnedStatuses[currentInstance] = $pinnedStatuses[currentInstance] || {}
      $pinnedStatuses[currentInstance][accountId] = statuses
      store.set({pinnedStatuses: $pinnedStatuses})
    }
  )
}
