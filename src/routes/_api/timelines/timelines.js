import {fetchTimeline} from "./timelineUtils";

export async function getTimeline (instanceName, accessToken, timeline, maxId, since, limit) {
  const items = await fetchTimeline(instanceName, accessToken, timeline, maxId, since, limit)

  if (timeline === 'direct') {
    return items.map(item => item.last_status)
  }
  return items
}
