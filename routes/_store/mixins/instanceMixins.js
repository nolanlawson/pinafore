export function instanceMixins (Store) {
  Store.prototype.setComposeData = function (realm, obj) {
    let composeData = this.get('composeData')
    let instanceName = this.get('currentInstance')
    let instanceNameData = composeData[instanceName] = composeData[instanceName] || {}
    instanceNameData[realm] = Object.assign(instanceNameData[realm] || {}, obj)
    this.set({composeData})
  }

  Store.prototype.getComposeData = function (realm, key) {
    let composeData = this.get('composeData')
    let instanceName = this.get('currentInstance')
    return composeData[instanceName] &&
      composeData[instanceName][realm] &&
      composeData[instanceName][realm][key]
  }
}
