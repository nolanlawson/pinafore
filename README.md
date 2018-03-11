# Pinafore

An alternative web client for [Mastodon](https://joinmastodon.org]).

## Goals and non-goals

This section lays out some high-level goals for Pinafore, as well as the goals it _doesn't_ intend to tackle.

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
- Ship in the Android/iOS app stores as a Cordova app
- Support Pleroma/non-Mastodon backends
- i18n

### Non-goals

- Supporting old browsers, proxy browsers, or text-based browsers
- React Native / NativeScript / hybrid-native version
- Full functionality with JavaScript disabled
- Emoji support beyond the built-in system emoji
- Custom emoji keyboard
- Multi-column support
- Keyboard shortcuts
- Admin/moderation panel
- Works offline in read-write mode

## Building

    npm install
    npm run build
    PORT=4002 npm start

Now it's running at `localhost:4002`.

## Development

    npm run dev

Now it's running at `localhost:4002`.

## Testing in development mode

In separate terminals:

1\. Run a Mastodon dev server (note this destroys the `mastodon_development` database and inserts canned data):

    npm run run-mastodon

2\. Run a Pinafore dev server:

    npm run dev

3\. Run a debuggable TestCafé instance:

    npx testcafe --hostname localhost --skip-js-errors --debug-mode firefox tests/spec

If you want to export the current data in the Mastodon instance as canned data, so that it can be loaded later:

    npm run backup-mastodon-data

## Testing

Lint:

    npm run lint

Run integration tests:

    npm test

Run tests for a particular browser:

    BROWSER=chrome npm run test-browser
    BROWSER=chrome:headless npm run test-browser
    BROWSER=firefox npm run test-browser
    BROWSER=firefox:headless npm run test-browser
    BROWSER=safari npm run test-browser
    BROWSER=edge npm run test-browser

Automatically fix most linting issues:

    npx standard --fix
