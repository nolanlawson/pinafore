# Pinafore [![Build Status](https://travis-ci.org/nolanlawson/pinafore.svg)](https://travis-ci.org/nolanlawson/pinafore) [![Greenkeeper badge](https://badges.greenkeeper.io/nolanlawson/pinafore.svg)](https://greenkeeper.io/)

An alternative web client for [Mastodon](https://joinmastodon.org]), focused on speed and simplicity.

Pinafore is available at [pinafore.social](https://pinafore.social). Bleeding-edge releases are at [dev.pinafore.social](https://dev.pinafore.social).

See the [user guide](https://github.com/nolanlawson/pinafore/blob/master/docs/User-Guide.md) for basic usage.

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

To build Pinafore for production:

    npm install
    npm run build
    PORT=4002 npm start

Now Pinafore is running at `localhost:4002`.

Pinafore requires [Node.js](https://nodejs.org/en/) v8+.

## Developing and testing

See [CONTRIBUTING.md](https://github.com/nolanlawson/pinafore/blob/master/CONTRIBUTING.md) for 
how to run Pinafore in dev mode and run tests.
