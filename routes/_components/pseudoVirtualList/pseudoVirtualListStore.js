import { Store } from 'svelte/store.js'

class PseudoVirtualListStore extends Store {
  setForRealm(obj) {
    let realmName = this.get('currentRealm')
    let realms = this.get('realms') || {}
    realms[realmName] = Object.assign(realms[realmName] || {}, obj)
    this.set({realms: realms})
  }
}

const pseudoVirtualListStore = new PseudoVirtualListStore()

pseudoVirtualListStore.compute('intersectionStates',
    ['realms', 'currentRealm'],
    (realms, currentRealm) => {
  return (realms && realms[currentRealm] && realms[currentRealm].intersectionStates) || {}
})

if (process.browser && process.env.NODE_NODE !== 'production') {
  window.pseudoVirtualListStore = pseudoVirtualListStore
}

export { pseudoVirtualListStore }