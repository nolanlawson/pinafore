export function instanceMixins (Store) {
  Store.prototype.setComposeData = function (realm, key, value) {
    let composeData = this.get('composeData')
    let instanceName = this.get('currentInstance')
    composeData[instanceName] = composeData[instanceName] || {}
    composeData[instanceName][realm] = composeData[instanceName][realm] || {}
    composeData[instanceName][realm][key] = value
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
