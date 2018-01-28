// Merge two lists of statuses for the same timeline, e.g. one from IDB
// and another from the network. In case of duplicates, prefer the fresh.
export function mergeStatuses(leftStatusIds, rightStatusIds) {
  let leftIndex = 0
  let rightIndex = 0
  let merged = []
  while (leftIndex < leftStatusIds.length || rightIndex < rightStatusIds.length) {
    if (leftIndex === leftStatusIds.length) {
      merged.push(rightStatusIds[rightIndex])
      rightIndex++
      continue
    }
    if (rightIndex === rightStatusIds.length) {
      merged.push(leftStatusIds[leftIndex])
      leftIndex++
      continue
    }
    let left = leftStatusIds[leftIndex]
    let right = rightStatusIds[rightIndex]
    if (right === left) {
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