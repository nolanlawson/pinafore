# Semaphore ⛳

> Continuation of the [Pinafore project](https://github.com/nolanlawson/pinafore). To keep from burning out it will have restricted input from wider community, more details will follow.
> 
> Credit must go to Nolan and the original contributors for their excellent work.

An alternative web client for [Mastodon](https://joinmastodon.org), focused on speed and simplicity.

Semaphore is available at [semaphore.social](https://semaphore.social). Beta releases are at [beta.semaphore.social](https://beta.semaphore.social).

See the [user guide](https://github.com/semaphore-social/semaphore/blob/main/docs/User-Guide.md) for basic usage. See the [admin guide](https://github.com/semaphore-social/semaphore/blob/main/docs/Admin-Guide.md) if Semaphore cannot connect to your instance.

For updates and support, follow [@semaphore@fosstodon.org](https://fosstodon.org/@semaphore).

## Browser support

Semaphore supports the latest versions of the following browsers:

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

Semaphore requires [Node.js](https://nodejs.org/en/) and [Yarn](https://yarnpkg.com).

To build Semaphore for production, first install dependencies:

    yarn --production --pure-lockfile

Then build:

    yarn build

Then run:

    PORT=4002 node server.js

### Docker

To build a Docker image for production:

    docker build .
    docker run -d -p 4002:4002 [your-image]

Now Semaphore is running at `localhost:4002`.

### docker-compose

Alternatively, use docker-compose to build and serve the image for production:

    docker-compose up --build -d

The image will build and start, then detach from the terminal running at `localhost:4002`.

### Updating

To keep your version of Semaphore up to date, you can use `git` to check out the latest tag:

    git checkout $(git tag -l | sort -Vr | head -n 1)

### Exporting

Semaphore is a static site. When you run `yarn build`, static files will be
written to `__sapper__/export`.

It is _not_ recommended to directly expose these files when self-hosting. Instead, you should use `node server.js` (e.g. with an
nginx or Apache proxy in front). This adds several things you don't get from the raw static files:

- [CSP headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) (important for security)
- Certain dynamic routes (less important because of Service Worker managing routing, but certain things could break if Service Workers are disabled in the user's browser)

Having an [nginx config generator](https://github.com/semaphore-social/semaphore/issues/1878) is currently an open issue.

## Developing and testing

See [CONTRIBUTING.md](https://github.com/semaphore-social/semaphore/blob/main/CONTRIBUTING.md) for
how to run Semaphore in dev mode and run tests.

## Changelog

For a changelog, see the [GitHub releases](http://github.com/semaphore-social/semaphore/releases/).

For a list of breaking changes, see [BREAKING_CHANGES.md](https://github.com/semaphore-social/semaphore/blob/main/BREAKING_CHANGES.md).


## What's with the name?

Semaphore is a fork of Pinafore and apparently they were going to call the boat H.M.S Semaphore but thought Pinafore was more fun.
Bonus - semaphore is an old communication method.
