// Some functions from Lodash that are a bit heavyweight and which
// we can just do in idiomatic ES2015+

export function get (obj, keys, defaultValue) {
  for (const key of keys) {
    if (obj && key in obj) {
      obj = obj[key]
    } else {
      return defaultValue
    }
  }
  return obj
}

export function pickBy (obj, predicate) {
  const res = {}
  for (const [key, value] of Object.entries(obj)) {
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

export function sum (list) {
  let total = 0
  for (const item of list) {
    total += item
  }
  return total
}

export function times (n, func) {
  const res = []
  for (let i = 0; i < n; i++) {
    res.push(func(i))
  }
  return res
}
