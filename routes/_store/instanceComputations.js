export function instanceComputations (store) {
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
    'currentTheme',
    ['currentInstance', 'instanceThemes'],
    (currentInstance, instanceThemes) => {
      return instanceThemes[currentInstance] || 'default'
    }
  )

  store.compute(
    'currentVerifyCredentials',
    ['currentInstance', 'verifyCredentials'],
    (currentInstance, verifyCredentials) => verifyCredentials && verifyCredentials[currentInstance]
  )

  store.compute(
    'currentInstanceInfo',
    ['currentInstance', 'instanceInfos'],
    (currentInstance, instanceInfos) => instanceInfos && instanceInfos[currentInstance]
  )

  store.compute(
    'pinnedPage',
    ['pinnedPages', 'currentInstance'],
    (pinnedPages, currentInstance) => (currentInstance && pinnedPages[currentInstance]) || '/local')

  store.compute(
    'lists',
    ['instanceLists', 'currentInstance'],
    (instanceLists, currentInstance) => (currentInstance && instanceLists[currentInstance]) || []
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
