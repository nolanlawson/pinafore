// utilities for working with Maps

export function mapBy (items, func) {
  const map = new Map()
  for (const item of items) {
    map.set(func(item), item)
  }
  return map
}

export function multimapBy (items, func) {
  const map = new Map()
  for (const item of items) {
    const key = func(item)
    if (map.has(key)) {
      map.get(key).push(item)
    } else {
      map.set(key, [item])
    }
  }
  return map
}
