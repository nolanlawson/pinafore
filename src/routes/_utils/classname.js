export function classname () {
  let res = ''
  const len = arguments.length
  let i = -1
  while (++i < len) {
    const item = arguments[i]
    if (item) {
      if (res) {
        res += ' '
      }
      res += item
    }
  }
  return res
}
