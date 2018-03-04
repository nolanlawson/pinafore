function computeForInstance (store, computedKey, key, defaultValue) {
  store.compute(computedKey,
    [key, 'currentInstance'],
    (instanceData, currentInstance) => (currentInstance && instanceData[currentInstance]) || defaultValue)
}

export function instanceComputations (store) {
  computeForInstance(store, 'currentTheme', 'instanceThemes', 'default')
  computeForInstance(store, 'currentVerifyCredentials', 'verifyCredentials', null)
  computeForInstance(store, 'currentInstanceInfo', 'instanceInfos', null)
  computeForInstance(store, 'pinnedPage', 'pinnedPages', '/local')
  computeForInstance(store, 'lists', 'instanceLists', [])
  computeForInstance(store, 'currentStatusModifications', 'statusModifications', null)
  computeForInstance(store, 'currentCustomEmoji', 'customEmoji', [])
  computeForInstance(store, 'currentComposeData', 'composeData', {})

  store.compute(
    'isUserLoggedIn',
    ['currentInstance', 'loggedInInstances'],
    (currentInstance, loggedInInstances) => !!(currentInstance && Object.keys(loggedInInstances).includes(currentInstance))
  )

  store.compute(
    'loggedInInstancesAsList',
    ['currentInstance', 'loggedInInstances', 'loggedInInstancesInOrder'],
    (currentInstance, loggedInInstances, loggedInInstancesInOrder) => {
      return loggedInInstancesInOrder.map(instanceName => {
        return Object.assign({
          current: currentInstance === instanceName,
          name: instanceName
        }, loggedInInstances[instanceName])
      })
    }
  )

  store.compute(
    'currentInstanceData',
    ['currentInstance', 'loggedInInstances'],
    (currentInstance, loggedInInstances) => {
      return Object.assign({
        name: currentInstance
      }, loggedInInstances[currentInstance])
    })

  store.compute(
    'accessToken',
    ['currentInstanceData'],
    (currentInstanceData) => currentInstanceData && currentInstanceData.access_token
  )

  store.compute(
    'pinnedListTitle',
    ['lists', 'pinnedPage'],
    (lists, pinnedPage) => {
      if (!pinnedPage.startsWith('/lists')) {
        return
      }
      let listId = pinnedPage.split('/').slice(-1)[0]
      let list = lists.find(_ => _.id === listId)
      return list ? list.title : ''
    }
  )
}
