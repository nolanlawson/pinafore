import { Store } from 'svelte/store.js'

const LOCAL_STORAGE_KEYS = new Set([
  "currentInstance",
  "currentRegisteredInstance",
  "currentRegisteredInstanceName",
  "instanceNameInSearch",
  "instanceThemes",
  "loggedInInstances",
  "loggedInInstancesInOrder"
])

const LS = process.browser && localStorage
class PinaforeStore extends Store {

  constructor(state) {
    super(state)
    if (process.browser) {
      this.keysToStore = {}
      let newState = {}
      for (let i = 0, len = LS.length; i < len; i++) {
        let key = LS.key(i)
        if (key.startsWith('store_')) {
          let item = LS.getItem(key)
          newState[key.substring(6)] = item === 'undefined' ? undefined : JSON.parse(item)
        }
      }
      this.set(newState)
      this.onchange((state, changed) => {
        Object.keys(changed).forEach(change => {
          if (LOCAL_STORAGE_KEYS.has(change)) {
            this.keysToStore[change] = true
          }
        })
      })
    }
  }

  save() {
    if (process.browser) {
      Object.keys(this.keysToStore).forEach(key => {
        LS.setItem(`store_${key}`, JSON.stringify(this.get(key)))
      })
      this.keysToStore = {}
    }
  }

  setForTimeline(instanceName, timelineName, obj) {
    let timelines = this.get('timelines') || {}
    let timelineData = timelines[instanceName] || {}
    timelineData[timelineName] = Object.assign(timelineData[timelineName] || {}, obj)
    timelines[instanceName] = timelineData
    this.set({timelines: timelines})
  }

  getForTimeline(instanceName, timelineName, key) {
    let timelines = this.get('timelines') || {}
    let timelineData = timelines[instanceName] || {}
    return (timelineData[timelineName] || {})[key]
  }
}

const store = new PinaforeStore({
  instanceNameInSearch: '',
  currentRegisteredInstance: null,
  currentRegisteredInstanceName: '',
  currentInstance: null,
  loggedInInstances: {},
  loggedInInstancesInOrder: [],
  instanceThemes: {}
})

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
  (currentInstanceData) => currentInstanceData.access_token
)

store.compute(
  'currentTheme',
  ['currentInstance', 'instanceThemes'],
  (currentInstance, instanceThemes) => {
    return instanceThemes[currentInstance] || 'default'
  }
)

store.compute('currentTimelineData', ['currentInstance', 'currentTimeline', 'timelines'],
  (currentInstance, currentTimeline, timelines) => {
  return ((timelines && timelines[currentInstance]) || {})[currentTimeline] || {}
})

store.compute('statusIds',     ['currentTimelineData'], (currentTimelineData) => currentTimelineData.statusIds || [])
store.compute('runningUpdate', ['currentTimelineData'], (currentTimelineData) => currentTimelineData.runningUpdate)
store.compute('initialized',   ['currentTimelineData'], (currentTimelineData) => currentTimelineData.initialized)
store.compute('lastStatusId',  ['statusIds'], (statusIds) => statusIds.length && statusIds[statusIds.length - 1])

if (process.browser && process.env.NODE_ENV !== 'production') {
  window.store = store // for debugging
}

export { store }