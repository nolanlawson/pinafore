# Pinafore [![No Maintenance Intended](http://unmaintained.tech/badge.svg)](http://unmaintained.tech/)

_**Note:** Pinafore is unmaintained. Read [this](https://nolanlawson.com/2023/01/09/retiring-pinafore/). Original documentation follows._

An alternative web client for [Mastodon](https://joinmastodon.org), focused on speed and simplicity.

Pinafore is available at [pinafore.social](https://pinafore.social). Beta releases are at [dev.pinafore.social](https://dev.pinafore.social).

See the [user guide](https://github.com/nolanlawson/pinafore/blob/master/docs/User-Guide.md) for basic usage. See the [admin guide](https://github.com/nolanlawson/pinafore/blob/master/docs/Admin-Guide.md) if Pinafore cannot connect to your instance.

For updates and support, follow [@pinafore@fosstodon.org](https://fosstodon.org/@pinafore).

## Browser support

Pinafore supports the latest versions of the following browsers:

- Chrome
- Edge
- Firefox
- Safari

Compatible versions of each (Opera, Brave, Samsung, etc.) should be fine.

## Goals and non-goals

### Goals

- Support the most common use cases
- Small page weight
- Fast even on low-end devices
- Accessibility
- Offline support in read-only mode
- Progressive Web App features
- Multi-instance support
- Support latest versions of Chrome, Edge, Firefox, and Safari
- Support non-Mastodon instances (e.g. Pleroma) as well as possible
- Internationalization

### Secondary / possible future goals

- Serve as an alternative frontend tied to a particular instance
- Offline search

### Non-goals

- Supporting old browsers, proxy browsers, or text-based browsers
- React Native / NativeScript / hybrid-native version
- Android/iOS apps (using Cordova or similar)
- Full functionality with JavaScript disabled
- Emoji support beyond the built-in system emoji
- Multi-column support
- Admin/moderation panel
- Offline support in read-write mode (would require sophisticated sync logic)

## Building

Pinafore requires [Node.js](https://nodejs.org/en/) and [Yarn](https://yarnpkg.com).

To build Pinafore for production, first install dependencies:

    yarn --production --pure-lockfile

Then build:

    yarn build

Then run:

    PORT=4002 node server.js

### Docker

To build a Docker image for production:

    docker build .
    docker run -d -p 4002:4002 [your-image]

Now Pinafore is running at `localhost:4002`.

### docker-compose

Alternatively, use docker-compose to build and serve the image for production:

    docker-compose up --build -d

The image will build and start, then detach from the terminal running at `localhost:4002`.

### Updating

To keep your version of Pinafore up to date, you can use `git` to check out the latest tag:

    git checkout $(git tag -l | sort -Vr | head -n 1)

### Exporting

Pinafore is a static site. When you run `yarn build`, static files will be
written to `__sapper__/export`.

It is _not_ recommended to directly expose these files when self-hosting. Instead, you should use `node server.js` (e.g. with an
nginx or Apache proxy in front). This adds several things you don't get from the raw static files:

- [CSP headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) (important for security)
- Certain dynamic routes (less important because of Service Worker managing routing, but certain things could break if Service Workers are disabled in the user's browser)

Having an [nginx config generator](https://github.com/nolanlawson/pinafore/issues/1878) is currently an open issue.

## Developing and testing

See [CONTRIBUTING.md](https://github.com/nolanlawson/pinafore/blob/master/CONTRIBUTING.md) for
how to run Pinafore in dev mode and run tests.

## Changelog

For a changelog, see the [GitHub releases](http://github.com/nolanlawson/pinafore/releases/).

For a list of breaking changes, see [BREAKING_CHANGES.md](https://github.com/nolanlawson/pinafore/blob/master/BREAKING_CHANGES.md).

## What's with the name?

Pinafore is named after the [Gilbert and Sullivan play](https://en.wikipedia.org/wiki/Hms_pinafore). The [soundtrack](https://www.allmusic.com/album/gilbert-sullivan-hms-pinafore-1949-mw0001830483) is very good.
