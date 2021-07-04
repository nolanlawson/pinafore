import { get } from '../../_utils/lodash-lite.js'

export function autosuggestMixins (Store) {
  Store.prototype.setForAutosuggest = function (instanceName, realm, obj) {
    const valuesToSet = {}
    for (const key of Object.keys(obj)) {
      const rootKey = `autosuggestData_${key}`
      const root = this.get()[rootKey] || {}
      const instanceData = root[instanceName] = root[instanceName] || {}
      instanceData[realm] = obj[key]
      valuesToSet[rootKey] = root
    }

    this.set(valuesToSet)
  }

  Store.prototype.setForCurrentAutosuggest = function (obj) {
    const { currentInstance, currentComposeRealm } = this.get()
    this.setForAutosuggest(currentInstance, currentComposeRealm, obj)
  }

  Store.prototype.getForCurrentAutosuggest = function (key) {
    const { currentInstance, currentComposeRealm } = this.get()
    return get(this.get()[`autosuggestData_${key}`], [currentInstance, currentComposeRealm])
  }

  Store.prototype.clearAutosuggestDataForInstance = function (instanceName) {
    const changes = {}
    Object.entries(this.get()).forEach(([key, value]) => {
      if (key.startsWith('autosuggestData_') && value) {
        delete value[instanceName]
        changes[key] = value
      }
    })
    this.set(changes)
  }
}
