export function replaceAll (string, replacee, replacement) {
  if (!string.length || !replacee.length) {
    return string
  }
  let idx
  let pos = 0
  while (true) {
    idx = string.indexOf(replacee, pos)
    if (idx === -1) {
      break
    }
    string = string.substring(0, idx) + replacement + string.substring(idx + replacee.length)
    pos = idx + replacement.length
  }
  return string
}
