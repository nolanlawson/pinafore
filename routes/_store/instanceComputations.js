export function instanceComputations(store) {
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
    'pinnedPage',
    ['pinnedPages', 'currentInstance'],
    (pinnedPages, currentInstance) => (currentInstance && pinnedPages[currentInstance]) || '/local')
}