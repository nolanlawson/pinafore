// Merge two arrays, assuming both input arrays have the same order
// and items are comparable
export function mergeArrays (leftArray, rightArray) {
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
    if (right === left) {
      merged.push(left)
      rightIndex++
      leftIndex++
    } else if (parseInt(right, 10) > parseInt(left, 10)) {
      merged.push(right)
      rightIndex++
    } else {
      merged.push(left)
      leftIndex++
    }
  }
  return merged
}
