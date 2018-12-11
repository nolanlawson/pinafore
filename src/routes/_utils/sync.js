// Hit both the cache and the network, setting state for the cached version first,
// then the network version (as it's assumed to be fresher). Also update the db afterwards.
export async function cacheFirstUpdateAfter (networkFetcher, dbFetcher, dbUpdater, stateSetter) {
  let networkPromise = networkFetcher() // kick off network request immediately
  let dbResponse
  try {
    dbResponse = await dbFetcher()
    stateSetter(dbResponse)
  } finally {
    let fetchAndUpdatePromise = networkPromise.then(networkResponse => {
      /* no await */ dbUpdater(networkResponse)
      stateSetter(networkResponse)
    })
    if (!dbResponse) { // no cached result available, await the network
      await fetchAndUpdatePromise
    }
  }
}

// Make a change that we optimistically show to the user as successful, but which
// actually depends on a network operation. In the unlikely event that the network
// operation fails, revert the changes
export async function optimisticUpdate (doImmediately, networkUpdater, onSuccess, onFailure) {
  let networkPromise = networkUpdater()
  doImmediately()
  try {
    let response = await networkPromise
    onSuccess(response)
  } catch (e) {
    console.error(e)
    onFailure(e)
  }
}
