import { thunk } from '../thunk'

export const isFirefox = thunk(() => {
  return process.browser && typeof InstallTrigger !== 'undefined' // https://stackoverflow.com/a/9851769/680742
})
