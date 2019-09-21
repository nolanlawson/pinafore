import { store } from '../_store/store'
import { cacheFirstUpdateAfter } from '../_utils/sync'
import { database } from '../_database/database'
import { getFollowRequests } from '../_api/followRequests'
import { get } from '../_utils/lodash-lite'

export async function updateFollowRequestCountIfLockedAccount (instanceName) {
  const { verifyCredentials, loggedInInstances } = store.get()

  if (!get(verifyCredentials, [instanceName, 'locked'])) {
    return
  }

  const accessToken = loggedInInstances[instanceName].access_token

  await cacheFirstUpdateAfter(
    async () => (await getFollowRequests(instanceName, accessToken)).length,
    () => database.getFollowRequestCount(instanceName),
    followReqsCount => database.setFollowRequestCount(instanceName, followReqsCount),
    followReqsCount => {
      const { followRequestCounts } = store.get()
      followRequestCounts[instanceName] = followReqsCount
      store.set({ followRequestCounts })
    }
  )
}
