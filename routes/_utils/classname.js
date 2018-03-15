export function classname () {
  let res = ''
  let len = arguments.length
  let i = -1
  while (++i < len) {
    let item = arguments[i]
    if (item) {
      if (res) {
        res += ' '
      }
      res += item
    }
  }
  return res
}
