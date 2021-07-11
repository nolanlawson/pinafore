import { thunk } from '../thunk.js'

export const isFirefoxPre90 = thunk(() => {
  return process.browser &&
    // https://stackoverflow.com/a/9851769/680742
    typeof InstallTrigger !== 'undefined' &&
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at#browser_compatibility
    !Array.prototype.at
})
