import { store } from '../_store/store'
import { cacheFirstUpdateAfter } from '../_utils/sync'
import { getPinnedStatuses } from '../_api/pinnedStatuses'
import { database } from '../_database/database'

export async function updatePinnedStatusesForAccount (accountId) {
  let instanceName = store.get('currentInstance')
  let accessToken = store.get('accessToken')

  await cacheFirstUpdateAfter(
    () => getPinnedStatuses(instanceName, accessToken, accountId),
    () => database.getPinnedStatuses(instanceName, accountId),
    statuses => database.insertPinnedStatuses(instanceName, accountId, statuses),
    statuses => {
      let $pinnedStatuses = store.get('pinnedStatuses')
      $pinnedStatuses[instanceName] = $pinnedStatuses[instanceName] || {}
      $pinnedStatuses[instanceName][accountId] = statuses
      store.set({pinnedStatuses: $pinnedStatuses})
    }
  )
}
