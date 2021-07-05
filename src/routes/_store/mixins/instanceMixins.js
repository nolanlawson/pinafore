import { get } from '../../_utils/lodash-lite.js'

export function instanceMixins (Store) {
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
