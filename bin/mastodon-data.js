import { times } from '../src/routes/_utils/lodash-lite.js'

function unrollThread (user, prefix, privacy, thread) {
  const res = []

  function unroll (node, parentKey) {
    if (!node) {
      return
    }
    for (const key of Object.keys(node)) {
      res.push({
        user: user,
        post: {
          internalId: prefix + key,
          text: key,
          privacy: privacy,
          inReplyTo: parentKey && (prefix + parentKey)
        }
      })
      unroll(node[key], key)
    }
  }
  unroll(thread)
  return res
}

export const actions = times(30, i => ({
  post: {
    text: '' + (i + 1)
  },
  user: 'admin'
})).concat([
  {
    user: 'foobar',
    post: {
      text: 'hello world'
    }
  },
  {
    user: 'admin',
    follow: 'foobar'
  },
  {
    user: 'admin',
    post: {
      text: '@foobar hello foobar',
      privacy: 'unlisted'
    }
  },
  {
    user: 'quux',
    follow: 'foobar'
  },
  {
    user: 'foobar',
    post: {
      text: '@admin hello admin',
      privacy: 'unlisted'
    }
  },
  {
    user: 'foobar',
    post: {
      text: "here's a kitten",
      media: ['kitten1.jpg']
    }
  },
  {
    user: 'foobar',
    post: {
      text: "here's a secret kitten",
      media: ['kitten2.jpg'],
      sensitive: true
    }
  },
  {
    user: 'foobar',
    post: {
      text: "here's 2 kitten photos",
      media: ['kitten3.jpg', 'kitten4.jpg']
    }
  },
  {
    user: 'foobar',
    post: {
      text: "here's an animated kitten gif",
      media: ['kitten1.gif']
    }
  },
  {
    user: 'foobar',
    post: {
      text: "here's a secret animated kitten gif",
      media: ['kitten2.gif'],
      sensitive: true
    }
  },
  {
    user: 'foobar',
    post: {
      text: 'content warning',
      spoiler: 'CW'
    }
  },
  {
    user: 'foobar',
    post: {
      text: "here's a video",
      media: ['kitten1.mp4']
    }
  },
  {
    user: 'foobar',
    post: {
      text: "here's a secret video",
      media: ['kitten2.mp4'],
      sensitive: true
    }
  },
  {
    user: 'foobar',
    post: {
      text: "here's a kitten with a CW",
      media: ['kitten5.jpg'],
      sensitive: true,
      spoiler: 'kitten CW'
    }
  },
  {
    user: 'foobar',
    post: {
      internalId: 'foobar-direct',
      text: 'direct',
      privacy: 'direct'
    }
  },
  {
    user: 'foobar',
    post: {
      internalId: 'foobar-this-is-followers-only',
      text: 'this is followers-only',
      privacy: 'private'
    }
  },
  {
    user: 'foobar',
    post: {
      internalId: 'foobar-this-is-unlisted',
      text: 'this is unlisted',
      privacy: 'unlisted'
    }
  },
  {
    user: 'admin',
    follow: 'quux'
  },
  {
    user: 'admin',
    post: {
      internalId: 'notification-of-direct-message',
      text: '@foobar notification of direct message',
      privacy: 'direct'
    }
  },
  {
    user: 'admin',
    favorite: 'notification-of-direct-message'
  },
  {
    user: 'admin',
    post: {
      internalId: 'notification-of-followers-only',
      text: '@foobar notification of followers-only message',
      privacy: 'private'
    }
  },
  {
    user: 'admin',
    favorite: 'notification-of-followers-only'
  },
  {
    user: 'admin',
    post: {
      internalId: 'notification-of-unlisted-message',
      text: '@foobar notification of unlisted message',
      privacy: 'unlisted'
    }
  },
  {
    user: 'admin',
    boost: 'foobar-this-is-unlisted'
  },
  {
    user: 'admin',
    favorite: 'foobar-this-is-unlisted'
  }
]).concat(times(25, i => ({
  user: 'quux',
  post: {
    internalId: `quux-thread-${i}`,
    text: 'unlisted thread ' + (i + 1),
    privacy: 'unlisted',
    inReplyTo: i > 0 && `quux-thread-${i - 1}`
  }
}))).concat([
  {
    user: 'quux',
    post: {
      internalId: 'pinned-toot-1',
      text: 'pinned toot 1',
      privacy: 'unlisted'
    }
  },
  {
    user: 'quux',
    post: {
      internalId: 'pinned-toot-2',
      text: 'pinned toot 2',
      privacy: 'unlisted'
    }
  },
  {
    user: 'quux',
    pin: 'pinned-toot-2'
  },
  {
    user: 'quux',
    pin: 'pinned-toot-1'
  },
  {
    user: 'admin',
    boost: 'pinned-toot-1'
  },
  {
    user: 'admin',
    favorite: 'pinned-toot-1'
  },
  {
    user: 'admin',
    favorite: 'pinned-toot-2'
  },
  {
    user: 'foobar',
    favorite: 'pinned-toot-1'
  },
  {
    user: 'foobar',
    favorite: 'notification-of-unlisted-message'
  },
  {
    user: 'foobar',
    favorite: 'notification-of-followers-only'
  },
  {
    user: 'foobar',
    favorite: 'notification-of-direct-message'
  },
  {
    user: 'foobar',
    pin: 'foobar-this-is-unlisted'
  },
  {
    user: 'ExternalLinks',
    post: {
      text: 'here are some hashtags: #kitten #kitties',
      privacy: 'unlisted'
    }
  },
  {
    user: 'ExternalLinks',
    post: {
      text: 'here are some external links: https://joinmastodon.org https://github.com/tootsuite/mastodon',
      privacy: 'unlisted'
    }
  },
  {
    user: 'ExternalLinks',
    post: {
      text: 'here are some users: @admin @quux',
      privacy: 'unlisted'
    }
  }
].concat(unrollThread('baz', 'bazthread-', 'unlisted', {
  'thread 1': {
    'thread 2': {
      'thread 2a': null,
      'thread 2b': {
        'thread 2b1': null
      },
      'thread 2c': null
    },
    'thread 3': {
      'thread 3a': null,
      'thread 3b': null,
      'thread 3c': null
    }
  }
})).concat([
  {
    user: 'baz',
    post: {
      internalId: 'bazthread-thread 2b2',
      text: 'thread 2b2',
      inReplyTo: 'bazthread-thread 2b',
      privacy: 'unlisted'
    }
  },
  {
    user: 'baz',
    post: {
      internalId: 'bazthread-thread 2d',
      text: 'thread 2d',
      inReplyTo: 'bazthread-thread 2',
      privacy: 'unlisted'
    }
  },
  {
    user: 'baz',
    post: {
      internalId: 'bazthread-thread 2b2a',
      text: 'thread 2b2a',
      inReplyTo: 'bazthread-thread 2b2',
      privacy: 'unlisted'
    }
  },
  {
    user: 'LockedAccount',
    post: {
      text: 'This account is locked',
      privacy: 'private'
    }
  }
]))
