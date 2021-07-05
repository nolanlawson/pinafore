import { store } from '../_store/store.js'

export function enablePoll (realm) {
  store.setComposeData(realm, {
    poll: {
      options: [
        '',
        ''
      ]
    }
  })
}

export function disablePoll (realm) {
  store.setComposeData(realm, {
    poll: null
  })
}
