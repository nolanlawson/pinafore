function timelineMixins (Store) {
  Store.prototype.setForTimeline = function (instanceName, timelineName, obj) {
    let timelines = this.get('timelines') || {}
    let timelineData = timelines[instanceName] || {}
    timelineData[timelineName] = Object.assign(timelineData[timelineName] || {}, obj)
    timelines[instanceName] = timelineData
    this.set({timelines: timelines})
  }

  Store.prototype.getForTimeline = function (instanceName, timelineName, key) {
    let timelines = this.get('timelines') || {}
    let timelineData = timelines[instanceName] || {}
    return (timelineData[timelineName] || {})[key]
  }

  Store.prototype.setForCurrentTimeline = function (obj) {
    let instanceName = this.get('currentInstance')
    let timelineName = this.get('currentTimeline')
    this.setForTimeline(instanceName, timelineName, obj)
  }
}

export function mixins (Store) {
  timelineMixins(Store)
}
