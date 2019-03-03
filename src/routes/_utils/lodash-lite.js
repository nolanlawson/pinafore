// Some functions from Lodash that are a bit heavyweight and which
// we can just do in idiomatic ES2015+

export function get (obj, keys, defaultValue) {
  for (let key of keys) {
    if (obj && key in obj) {
      obj = obj[key]
    } else {
      return defaultValue
    }
  }
  return obj
}

export function pickBy (obj, predicate) {
  let res = {}
  for (let [key, value] of Object.entries(obj)) {
    if (predicate(value, key)) {
      res[key] = value
    }
  }
  return res
}

export function padStart (string, length, chars) {
  while (string.length < length) {
    string = chars + string
  }
  return string
}
