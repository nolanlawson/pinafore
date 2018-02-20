# Pinafore

An alternative web client for [Mastodon](https://joinmastodon.org]).

## Building

    npm install
    npm run build
    PORT=4002 npm start

## Development

    npm run dev

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