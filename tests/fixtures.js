import { times } from './utils'

export const homeTimeline = [
  { content: 'pinned toot 1' },
  { content: 'notification of unlisted message' },
  { content: 'notification of followers-only message' },
  { content: 'notification of direct message' },
  { content: 'this is unlisted' },
  { content: 'this is followers-only' },
  { content: 'direct' },
  { spoiler: 'kitten CW' },
  { content: 'secret video' },
  { content: "here's a video" },
  { spoiler: 'CW' },
  { content: "here's a secret animated kitten gif" },
  { content: "here's an animated kitten gif" },
  { content: "here's 2 kitten photos" },
  { content: "here's a secret kitten" },
  { content: "here's a kitten" },
  { content: 'hello admin' },
  { content: 'hello foobar' },
  { content: 'hello world' }
].concat(times(30, i => ({ content: (30 - i).toString() })))

export const localTimeline = [
  { spoiler: 'kitten CW' },
  { content: 'secret video' },
  { content: "here's a video" },
  { spoiler: 'CW' },
  { content: "here's a secret animated kitten gif" },
  { content: "here's an animated kitten gif" },
  { content: "here's 2 kitten photos" },
  { content: "here's a secret kitten" },
  { content: "here's a kitten" },
  { content: 'hello world' }
].concat(times(30, i => ({ content: (30 - i).toString() })))

export const notifications = [
  { favoritedBy: 'admin' },
  { rebloggedBy: 'admin' },
  { content: 'notification of unlisted message' },
  { content: 'notification of followers-only message' },
  { content: 'notification of direct message' },
  { followedBy: 'quux' },
  { content: 'hello foobar' },
  { followedBy: 'admin' }
]

export const notificationsMentions = [
  { content: 'notification of unlisted message' },
  { content: 'notification of followers-only message' },
  { content: 'notification of direct message' },
  { content: 'hello foobar' }
]

export const favorites = [
  { content: 'notification of direct message' },
  { content: 'notification of followers-only message' },
  { content: 'notification of unlisted message' },
  { content: 'pinned toot 1' }
]

export const directMessages = [
  { content: 'notification of direct message' },
  { content: 'direct' }
]

export const quuxStatuses = [
  { content: 'pinned toot 2' },
  { content: 'pinned toot 1' }
].concat(times(25, i => ({ content: `unlisted thread ${25 - i}` })))

export const quuxThread = times(25, i => ({ content: `unlisted thread ${i + 1}` }))

export const bazThreadRelativeTo2B2 = [
  { content: 'thread 1' },
  { content: 'thread 2' },
  { content: 'thread 2b' },
  { content: 'thread 2b2' },
  { content: 'thread 2b2a' }
]

export const bazThreadRelativeTo2b = [
  { content: 'thread 1' },
  { content: 'thread 2' },
  { content: 'thread 2b' },
  { content: 'thread 2b1' },
  { content: 'thread 2b2' },
  { content: 'thread 2b2a' }
]

export const bazThreadRelativeTo2 = [
  { content: 'thread 1' },
  { content: 'thread 2' },
  { content: 'thread 2a' },
  { content: 'thread 2b' },
  { content: 'thread 2b1' },
  { content: 'thread 2b2' },
  { content: 'thread 2b2a' },
  { content: 'thread 2c' }
]
