// Merge two lists of statuses for the same timeline, e.g. one from IDB
// and another from the network. In case of duplicates, prefer the fresh.
export function mergeStatuses(leftStatuses, rightStatuses) {
  let leftIndex = 0
  let rightIndex = 0
  let merged = []
  while (leftIndex < leftStatuses.length || rightIndex < rightStatuses.length) {
    if (leftIndex === leftStatuses.length) {
      merged.push(rightStatuses[rightIndex])
      rightIndex++
      continue
    }
    if (rightIndex === rightStatuses.length) {
      merged.push(leftStatuses[leftIndex])
      leftIndex++
      continue
    }
    let left = leftStatuses[leftIndex]
    let right = rightStatuses[rightIndex]
    if (right.id === left.id) {
      merged.push(right.pinafore_stale ? left : right)
      rightIndex++
      leftIndex++
    } else if (parseInt(right.id, 10) > parseInt(left.id, 10)) {
      merged.push(right)
      rightIndex++
    } else {
      merged.push(left)
      leftIndex++
    }
  }
  return merged
}