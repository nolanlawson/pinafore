export function  findall (text, regex) {
  let result = []

  while (true) {
    let match = regex.exec(text)
    if (!match) {
      break
    }
    result = result.concat(match.slice(1))
  }

  return result
}
