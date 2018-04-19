function getStatusModifications (store, instanceName) {
  let { statusModifications } = store.get()
  statusModifications[instanceName] = statusModifications[instanceName] || {
    favorites: {},
    reblogs: {}
  }
  return statusModifications
}

export function statusMixins (Store) {
  Store.prototype.setStatusFavorited = function (instanceName, statusId, favorited) {
    let statusModifications = getStatusModifications(this, instanceName)
    statusModifications[instanceName].favorites[statusId] = favorited
    this.set({statusModifications})
  }

  Store.prototype.setStatusReblogged = function (instanceName, statusId, reblogged) {
    let statusModifications = getStatusModifications(this, instanceName)
    statusModifications[instanceName].reblogs[statusId] = reblogged
    this.set({statusModifications})
  }
}
