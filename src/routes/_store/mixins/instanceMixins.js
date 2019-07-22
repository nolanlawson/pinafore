import { get } from '../../_utils/lodash-lite'

export function instanceMixins (Store) {
  Store.prototype.setComposeData = function (realm, obj) {
    const { composeData, currentInstance } = this.get()
    const instanceNameData = composeData[currentInstance] = composeData[currentInstance] || {}
    instanceNameData[realm] = Object.assign(instanceNameData[realm] || {}, obj)
    this.set({ composeData })
  }

  Store.prototype.getComposeData = function (realm, key) {
    const { composeData, currentInstance } = this.get()
    return composeData[currentInstance] &&
      composeData[currentInstance][realm] &&
      composeData[currentInstance][realm][key]
  }

  Store.prototype.clearComposeData = function (realm) {
    const { composeData, currentInstance } = this.get()
    if (composeData && composeData[currentInstance]) {
      delete composeData[currentInstance][realm]
    }
    this.set({ composeData })
  }

  Store.prototype.getInstanceSetting = function (instanceName, settingName, defaultValue) {
    const { instanceSettings } = this.get()
    return get(instanceSettings, [instanceName, settingName], defaultValue)
  }

  Store.prototype.setInstanceSetting = function (instanceName, settingName, value) {
    const { instanceSettings } = this.get()
    if (!instanceSettings[instanceName]) {
      instanceSettings[instanceName] = {}
    }
    instanceSettings[instanceName][settingName] = value
    this.set({ instanceSettings })
  }

  Store.prototype.setInstanceData = function (instanceName, key, value) {
    const instanceData = this.get()[key] || {}
    instanceData[instanceName] = value
    this.set({ [key]: instanceData })
  }

  Store.prototype.getInstanceData = function (instanceName, key) {
    const instanceData = this.get()[key] || {}
    return instanceData[instanceName]
  }
}
