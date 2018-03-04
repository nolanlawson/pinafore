export function timelineMixins (Store) {
  Store.prototype.setForTimeline = function (instanceName, timelineName, obj) {
    let valuesToSet = {}
    for (let key of Object.keys(obj)) {
      let rootKey = `timelineData_${key}`
      let root = this.get(rootKey) || {}
      let instanceData = root[instanceName] = root[instanceName] || {}
      instanceData[timelineName] = obj[key]
      valuesToSet[rootKey] = root
    }

    this.set(valuesToSet)
  }

  Store.prototype.getForTimeline = function (instanceName, timelineName, key) {
    let rootKey = `timelineData_${key}`
    let root = this.get(rootKey)
    return root && root[instanceName] && root[instanceName][timelineName]
  }

  Store.prototype.setForCurrentTimeline = function (obj) {
    let instanceName = this.get('currentInstance')
    let timelineName = this.get('currentTimeline')
    this.setForTimeline(instanceName, timelineName, obj)
  }
}
