// Cache that allows for prefetching of timeline data as early as possible.
// We don't use <link rel=preload> because we need to pass in the auth, and it doesn't
// work on Firefox: https://bugzilla.mozilla.org/show_bug.cgi?id=1222633#c126
import { QuickLRU } from '../../_thirdparty/quick-lru/quick-lru'
import {fetchTimeline} from "./timelineUtils";
import {TIMELINE_BATCH_SIZE} from "../../_static/timelines";

const cache = new QuickLRU({maxSize: 5})

function createKey(instanceName, timelineName) {
  return `${instanceName}/${timelineName}`
}

export function preloadTimeline(instanceName, accessToken, timelineName) {
  const promise = fetchTimeline(instanceName, accessToken, timelineName, null, null, TIMELINE_BATCH_SIZE)
  cache.set(createKey(instanceName, timelineName), promise)
}
