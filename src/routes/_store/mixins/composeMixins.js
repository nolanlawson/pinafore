import { get } from '../../_utils/lodash-lite.js'

export function composeMixins (Store) {
  Store.prototype.setComposeData = function (realm, obj) {
    const { composeData, currentInstance } = this.get()
    const instanceNameData = composeData[currentInstance] = composeData[currentInstance] || {}
    instanceNameData[realm] = Object.assign(
      instanceNameData[realm] || {},
      { ts: Date.now() },
      obj
    )
    this.set({ composeData })
  }

  Store.prototype.getComposeData = function (realm, key) {
    const { composeData, currentInstance } = this.get()
    return get(composeData, [currentInstance, realm, key])
  }

  Store.prototype.clearComposeData = function (realm) {
    const { composeData, currentInstance } = this.get()
    if (composeData && composeData[currentInstance]) {
      delete composeData[currentInstance][realm]
    }
    this.set({ composeData })
  }
}
