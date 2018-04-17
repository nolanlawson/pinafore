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
  let instanceName = store.get('currentInstance')
  let accessToken = store.get('accessToken')

  await cacheFirstUpdateAfter(
    () => getPinnedStatuses(instanceName, accessToken, accountId),
    () => getPinnedStatusesFromDatabase(instanceName, accountId),
    statuses => insertPinnedStatusesInDatabase(instanceName, accountId, statuses),
    statuses => {
      let $pinnedStatuses = store.get('pinnedStatuses')
      $pinnedStatuses[instanceName] = $pinnedStatuses[instanceName] || {}
      $pinnedStatuses[instanceName][accountId] = statuses
      store.set({pinnedStatuses: $pinnedStatuses})
    }
  )
}
