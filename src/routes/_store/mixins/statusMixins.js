function getStatusModifications (store, instanceName) {
  const { statusModifications } = store.get()
  statusModifications[instanceName] = statusModifications[instanceName] || {
    favorites: {},
    reblogs: {},
    pins: {},
    bookmarks: {}
  }
  return statusModifications
}

function setStatusModification (store, instanceName, statusId, key, value) {
  const statusModifications = getStatusModifications(store, instanceName)
  statusModifications[instanceName][key][statusId] = value
  store.set({ statusModifications })
}

export function statusMixins (Store) {
  Store.prototype.setStatusFavorited = function (instanceName, statusId, favorited) {
    setStatusModification(this, instanceName, statusId, 'favorites', favorited)
  }

  Store.prototype.setStatusReblogged = function (instanceName, statusId, reblogged) {
    setStatusModification(this, instanceName, statusId, 'reblogs', reblogged)
  }

  Store.prototype.setStatusPinned = function (instanceName, statusId, pinned) {
    setStatusModification(this, instanceName, statusId, 'pins', pinned)
  }

  Store.prototype.setStatusBookmarked = function (instanceName, statusId, bookmarked) {
    setStatusModification(this, instanceName, statusId, 'bookmarks', bookmarked)
  }
}
