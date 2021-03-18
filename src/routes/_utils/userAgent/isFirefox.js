export function isFirefox () {
  return typeof InstallTrigger !== 'undefined' // https://stackoverflow.com/a/9851769/680742
}
