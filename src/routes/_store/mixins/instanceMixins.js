export function instanceMixins (Store) {
  Store.prototype.setComposeData = function (realm, obj) {
    let { composeData, currentInstance } = this.get()
    let instanceNameData = composeData[currentInstance] = composeData[currentInstance] || {}
    instanceNameData[realm] = Object.assign(instanceNameData[realm] || {}, obj)
    this.set({ composeData })
  }

  Store.prototype.getComposeData = function (realm, key) {
    let { composeData, currentInstance } = this.get()
    return composeData[currentInstance] &&
      composeData[currentInstance][realm] &&
      composeData[currentInstance][realm][key]
  }

  Store.prototype.clearComposeData = function (realm) {
    let { composeData, currentInstance } = this.get()
    if (composeData && composeData[currentInstance]) {
      delete composeData[currentInstance][realm]
    }
    this.set({ composeData })
  }
}
