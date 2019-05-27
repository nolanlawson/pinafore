import { store } from '../_store/store'

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
