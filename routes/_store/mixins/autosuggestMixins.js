export function autosuggestMixins (Store) {
  Store.prototype.setForAutosuggest = function (instanceName, realm, obj) {
    let valuesToSet = {}
    for (let key of Object.keys(obj)) {
      let rootKey = `autosuggestData_${key}`
      let root = this.get()[rootKey] || {}
      let instanceData = root[instanceName] = root[instanceName] || {}
      instanceData[realm] = obj[key]
      valuesToSet[rootKey] = root
    }

    this.set(valuesToSet)
  }

  Store.prototype.setForCurrentAutosuggest = function (obj) {
    let { currentInstance, currentComposeRealm } = this.get()
    this.setForAutosuggest(currentInstance, currentComposeRealm, obj)
  }
}
