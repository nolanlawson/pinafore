// Hit both the cache and the network, setting state for the cached version first,
// then the network version (as it's assumed to be fresher). Also update the db afterwards.
export async function cacheFirstUpdateAfter (networkFetcher, dbFetcher, dbUpdater, stateSetter) {
  const networkPromise = networkFetcher() // kick off network request immediately
  let dbResponse
  try {
    dbResponse = await dbFetcher()
  } catch (err) {
    console.error('ignored DB error', err)
  } finally {
    if (dbResponse) {
      stateSetter(dbResponse)
    }
    const fetchAndUpdatePromise = networkPromise.then(networkResponse => {
      /* no await */ dbUpdater(networkResponse)
      stateSetter(networkResponse)
    })
    if (!dbResponse) { // no cached result available, await the network
      await fetchAndUpdatePromise
    }
  }
}

// Try the cache first. If we get a hit, set the state and do nothing. If we don't get a cache hit,
// then go to the network, update the cache, and set the state.
export async function cacheFirstUpdateOnlyIfNotInCache (networkFetcher, dbFetcher, dbUpdater, stateSetter) {
  let dbResponse
  try {
    dbResponse = await dbFetcher()
  } catch (err) {
    console.error('ignored DB error', err)
  }
  if (dbResponse) {
    stateSetter(dbResponse)
  } else {
    const networkResponse = await networkFetcher()
    /* no await */ dbUpdater(networkResponse)
    stateSetter(networkResponse)
  }
}
