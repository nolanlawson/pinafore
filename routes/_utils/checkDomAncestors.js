// Check if some condition applies for a node or any of its ancestors,
// stopping at an element that returns true for the given stopFunc. Returns
// false if none match
export function checkDomAncestors (node, checkFunc, stopFunc) {
  let thisNode = node
  while (thisNode) {
    if (stopFunc(thisNode)) {
      break
    }
    if (checkFunc(thisNode)) {
      return true
    }
    thisNode = thisNode.parentElement
  }
  return false
}
