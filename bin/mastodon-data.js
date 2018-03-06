import times from 'lodash/times'

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
      media: ['kitten2.mp4']
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
      internalId: 11,
      text: 'direct',
      privacy: 'direct'
    }
  },
  {
    user: 'foobar',
    post: {
      internalId: 10,
      text: 'this is followers-only',
      privacy: 'private'
    }
  },
  {
    user: 'foobar',
    post: {
      internalId: 2,
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
      internalId: 3,
      text: '@foobar notification of direct message',
      privacy: 'direct'
    }
  },
  {
    user: 'admin',
    favorite: 3
  },
  {
    user: 'admin',
    post: {
      internalId: 4,
      text: '@foobar notification of followers-only message',
      privacy: 'private'
    }
  },
  {
    user: 'admin',
    favorite: 4
  },
  {
    user: 'admin',
    post: {
      internalId: 1,
      text: '@foobar notification of unlisted message',
      privacy: 'unlisted'
    }
  },
  {
    user: 'admin',
    boost: 1
  },
  {
    user: 'admin',
    boost: 2
  },
  {
    user: 'admin',
    favorite: 2
  }
]).concat(times(25, i => ({
  user: 'quux',
  post: {
    internalId: 100 + i,
    text: 'unlisted thread ' + (i + 1),
    privacy: 'unlisted',
    inReplyTo: i > 0 && (100 + i)
  }
}))).concat([
  {
    user: 'quux',
    post: {
      internalId: 5,
      text: 'pinned toot 1',
      privacy: 'unlisted'
    }
  },
  {
    user: 'quux',
    post: {
      internalId: 6,
      text: 'pinned toot 2',
      privacy: 'unlisted'
    }
  },
  {
    user: 'quux',
    pin: 5
  },
  {
    user: 'quux',
    pin: 6
  },
  {
    user: 'admin',
    boost: 5
  },
  {
    user: 'admin',
    favorite: 5
  },
  {
    user: 'admin',
    favorite: 6
  },
  {
    user: 'foobar',
    favorite: 5
  },
  {
    user: 'foobar',
    favorite: 2
  },
  {
    user: 'foobar',
    favorite: 10
  },
  {
    user: 'foobar',
    favorite: 3
  },
  {
    user: 'foobar',
    pin: 2
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
])
