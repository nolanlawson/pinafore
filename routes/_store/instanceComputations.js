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

  store.compute('numberOfNotifications',
    ['timelines', 'currentInstance', 'currentTimeline'],
    (timelines, currentInstance, currentTimeline) => {
      return currentTimeline !== 'notifications' &&
        timelines &&
        timelines[currentInstance] &&
        timelines[currentInstance].notifications &&
        timelines[currentInstance].notifications.itemIdsToAdd &&
        timelines[currentInstance].notifications.itemIdsToAdd.length
    }
  )

  store.compute('hasNotifications',
    ['numberOfNotifications'],
    (numberOfNotifications) => {
      return !!numberOfNotifications
    }
  )

  store.compute('currentStatusModifications',
    ['statusModifications', 'currentInstance'],
    (statusModifications, currentInstance) => {
      return statusModifications[currentInstance]
    })

  store.compute('currentComposeText',
    ['composeText', 'currentInstance'],
    (composeText, currentInstance) => (composeText[currentInstance] || {})
  )

  store.compute('currentUploadedMedia',
    ['uploadedMedia', 'currentInstance'],
    (uploadedMedia, currentInstance) => (uploadedMedia[currentInstance] || {})
  )

  store.compute('currentCustomEmoji',
    ['customEmoji', 'currentInstance'],
    (customEmoji, currentInstance) => (customEmoji[currentInstance] || [])
  )
}
