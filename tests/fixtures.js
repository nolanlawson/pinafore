import times from 'lodash/times'

export const homeTimeline = [
  {content: 'pinned toot 1'},
  {content: 'notification of unlisted message'},
  {content: 'notification of followers-only message'},
  {content: 'notification of direct message'},
  {content: 'this is unlisted'},
  {content: 'this is followers-only'},
  {content: 'direct'},
  {spoiler: 'kitten CW'},
  {content: 'secret video'},
  {content: "here's a video"},
  {spoiler: 'CW'},
  {content: "here's a secret animated kitten gif"},
  {content: "here's an animated kitten gif"},
  {content: "here's 2 kitten photos"},
  {content: "here's a secret kitten"},
  {content: "here's a kitten"},
  {content: 'hello admin'},
  {content: 'hello foobar'},
  {content: 'hello world'}
].concat(times(30, i => ({content: (30 - i).toString()})))

export const localTimeline = [
  {spoiler: 'kitten CW'},
  {content: 'secret video'},
  {content: "here's a video"},
  {spoiler: 'CW'},
  {content: "here's a secret animated kitten gif"},
  {content: "here's an animated kitten gif"},
  {content: "here's 2 kitten photos"},
  {content: "here's a secret kitten"},
  {content: "here's a kitten"},
  {content: 'hello world'}
].concat(times(30, i => ({content: (30 - i).toString()})))

export const notifications = [
  {favoritedBy: 'admin'},
  {rebloggedBy: 'admin'},
  {content: 'notification of unlisted message'},
  {content: 'notification of followers-only message'},
  {content: 'notification of direct message'},
  {followedBy: 'quux'},
  {content: 'hello foobar'},
  {followedBy: 'admin'}
]

export const favorites = [
  {content: 'notification of direct message'},
  {content: 'notification of followers-only message'},
  {content: 'notification of unlisted message'},
  {content: 'pinned toot 1'}
]

export const quuxStatuses = [
  {content: 'pinned toot 2'},
  {content: 'pinned toot 1'}
].concat(times(25, i => ({content: `unlisted thread ${25 - i}`})))

export const quuxThread = times(25, i => ({content: `unlisted thread ${i + 1}`}))
