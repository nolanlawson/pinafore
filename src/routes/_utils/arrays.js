// Merge two arrays, using the given comparator
export function mergeArrays (leftArray, rightArray, comparator) {
  let leftIndex = 0
  let rightIndex = 0
  let merged = []
  while (leftIndex < leftArray.length || rightIndex < rightArray.length) {
    if (leftIndex === leftArray.length) {
      merged.push(rightArray[rightIndex])
      rightIndex++
      continue
    }
    if (rightIndex === rightArray.length) {
      merged.push(leftArray[leftIndex])
      leftIndex++
      continue
    }
    let left = leftArray[leftIndex]
    let right = rightArray[rightIndex]
    let comparison = comparator(right, left)
    if (comparison === 0) {
      merged.push(left)
      rightIndex++
      leftIndex++
    } else if (comparison > 0) {
      merged.push(right)
      rightIndex++
    } else {
      merged.push(left)
      leftIndex++
    }
  }
  return merged
}

export function concat () {
  let res = []
  for (let i = 0, len = arguments.length; i < len; i++) {
    let arg = arguments[i]
    if (Array.isArray(arg)) {
      res = res.concat(arguments[i])
    } else {
      res.push(arguments[i])
    }
  }
  return res
}

export function indexWhere (arr, cb) {
  for (let i = 0; i < arr.length; i++) {
    if (cb(arr[i], i)) {
      return i
    }
  }
  return -1
}
