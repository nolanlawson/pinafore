export function getFirstIdFromItemSummaries (itemSummaries) {
  return itemSummaries &&
    itemSummaries[0] &&
    itemSummaries[0].id
}

export function getLastIdFromItemSummaries (itemSummaries) {
  return itemSummaries &&
    itemSummaries[itemSummaries.length - 1] &&
    itemSummaries[itemSummaries.length - 1].id
}
