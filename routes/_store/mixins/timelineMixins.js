import pickBy from 'lodash-es/pickBy'
import get from 'lodash-es/get'

export function timelineMixins (Store) {
  Store.prototype.setForTimeline = function (instanceName, timelineName, obj) {
    let valuesToSet = {}
    for (let key of Object.keys(obj)) {
      let rootKey = `timelineData_${key}`
      let root = this.get()[rootKey] || {}
      let instanceData = root[instanceName] = root[instanceName] || {}
      instanceData[timelineName] = obj[key]
      valuesToSet[rootKey] = root
    }

    this.set(valuesToSet)
  }

  Store.prototype.getForTimeline = function (instanceName, timelineName, key) {
    let rootKey = `timelineData_${key}`
    let root = this.get()[rootKey]
    return get(root, [instanceName, timelineName])
  }

  Store.prototype.getForCurrentTimeline = function (key) {
    let { currentInstance, currentTimeline } = this.get()
    return this.getForTimeline(currentInstance, currentTimeline, key)
  }

  Store.prototype.getAllTimelineData = function (instanceName, key) {
    let root = this.get()[`timelineData_${key}`] || {}
    return root[instanceName] || {}
  }

  Store.prototype.setForCurrentTimeline = function (obj) {
    let { currentInstance, currentTimeline } = this.get()
    this.setForTimeline(currentInstance, currentTimeline, obj)
  }

  Store.prototype.getThreads = function (instanceName) {
    let instanceData = this.getAllTimelineData(instanceName, 'timelineItemIds')

    return pickBy(instanceData, (value, key) => {
      return key.startsWith('status/')
    })
  }
}
