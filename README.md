# Pinafore [![Build Status](https://travis-ci.org/nolanlawson/pinafore.svg)](https://travis-ci.org/nolanlawson/pinafore) [![Greenkeeper badge](https://badges.greenkeeper.io/nolanlawson/pinafore.svg)](https://greenkeeper.io/)

An alternative web client for [Mastodon](https://joinmastodon.org), focused on speed and simplicity.

Pinafore is available at [pinafore.social](https://pinafore.social). Bleeding-edge releases are at [dev.pinafore.social](https://dev.pinafore.social).

See the [user guide](https://github.com/nolanlawson/pinafore/blob/master/docs/User-Guide.md) for basic usage. See the [admin guide](https://github.com/nolanlawson/pinafore/blob/master/docs/Admin-Guide.md) to troubleshoot instance compatibility issues.

For updates and support, follow us at [@pinafore@mastodon.technology](https://mastodon.technology/@pinafore).

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
- Fast even on low-end phones
- Works offline in read-only mode
- Progressive Web App features
- Multi-instance support
- Support latest versions of Chrome, Edge, Firefox, and Safari
- a11y (keyboard navigation, screen readers)

### Possible future goals

- Works as an alternative frontend self-hosted by instances
- Android/iOS apps (using Cordova or similar)
- Support Pleroma/non-Mastodon backends
- i18n
- Offline search
- Full emoji keyboard
- Keyboard shortcuts

### Non-goals

- Supporting old browsers, proxy browsers, or text-based browsers
- React Native / NativeScript / hybrid-native version
- Full functionality with JavaScript disabled
- Emoji support beyond the built-in system emoji
- Multi-column support
- Admin/moderation panel
- Works offline in read-write mode (would require sophisticated sync logic)

## Building

Pinafore requires [Node.js](https://nodejs.org/en/) v8+ and `npm`.

To build Pinafore for production:

    npm install
    npm run build
    PORT=4002 npm start

### Docker

To build a docker image for production:

    docker build .
    docker run -d -p 4002:4002 [your-image]

Now Pinafore is running at `localhost:4002`.

### Updating

To keep your version of Pinafore up to date, you can use `git` to check out the latest tag:

    git checkout $(git tag -l | sort -Vr | head -n 1)

### Exporting

You can export Pinafore as a static site. Run:

    npm run export

Static files will be written to `__sapper__/export`.

Note that this is not the recommended method, because
[CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) headers are not 
currently supported for the exported version.

## Developing and testing

See [CONTRIBUTING.md](https://github.com/nolanlawson/pinafore/blob/master/CONTRIBUTING.md) for 
how to run Pinafore in dev mode and run tests.

## Changelog

For a changelog, see the [GitHub releases](http://github.com/nolanlawson/pinafore/releases/).
