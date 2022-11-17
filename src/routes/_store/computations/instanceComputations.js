import { DEFAULT_THEME } from '../../_utils/themeEngine.js'
import { mark, stop } from '../../_utils/marks.js'
import { MAX_STATUS_CHARS } from '../../_static/statuses.js'

function computeForInstance (store, computedKey, key, defaultValue) {
  store.compute(computedKey,
    [key, 'currentInstance'],
    (instanceData, currentInstance) => (currentInstance && instanceData[currentInstance]) || defaultValue)
}

export function instanceComputations (store) {
  mark('instanceComputations')
  computeForInstance(store, 'currentTheme', 'instanceThemes', DEFAULT_THEME)
  computeForInstance(store, 'currentVerifyCredentials', 'verifyCredentials', null)
  computeForInstance(store, 'currentInstanceInfo', 'instanceInfos', null)
  computeForInstance(store, 'pinnedPage', 'pinnedPages', '/local')
  computeForInstance(store, 'lists', 'instanceLists', [])
  computeForInstance(store, 'filters', 'instanceFilters', [])
  computeForInstance(store, 'currentStatusModifications', 'statusModifications', null)
  computeForInstance(store, 'currentCustomEmoji', 'customEmoji', [])
  computeForInstance(store, 'currentComposeData', 'composeData', {})
  computeForInstance(store, 'currentPushSubscription', 'pushSubscriptions', null)

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
    'maxStatusChars',
    ['currentInstanceInfo'],
    (currentInstanceInfo) => {
      if (currentInstanceInfo) {
        if (currentInstanceInfo.max_toot_chars) {
          // unofficial api used in glitch-soc and pleroma
          return currentInstanceInfo.max_toot_chars
        }
        if (currentInstanceInfo.configuration && currentInstanceInfo.configuration.statuses && currentInstanceInfo.configuration.statuses.max_characters) {
          return currentInstanceInfo.configuration.statuses.max_characters
        }
      }
      return MAX_STATUS_CHARS
    }
  )

  stop('instanceComputations')
}
