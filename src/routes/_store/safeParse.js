export function safeParse (str) {
  return !str ? undefined : (str === 'undefined' ? undefined : JSON.parse(str))
}
