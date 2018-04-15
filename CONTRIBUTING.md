# Contributing to Pinafore

## Caveats

Please note that this project is _very_ beta right now, and I'm 
not in a good position to accept large PRs for 
big new features.

I'm making my code open-source for the sake of
transparency and because it's the right thing to do, but I'm hesitant
to start nurturing a community because of 
[all that entails](https://nolanlawson.com/2017/03/05/what-it-feels-like-to-be-an-open-source-maintainer/).

So I may not be very responsive to PRs or issues. Thanks for understanding.

## Development

To run a dev server with hot reloading:

    npm run dev

Now it's running at `localhost:4002`.

## Linting

Pinafore uses [JavaScript Standard Style](https://standardjs.com/).

Lint:

    npm run lint

Automatically fix most linting issues:

    npx standard --fix

## Testing

Testing requires running Mastodon itself, meaning the [Mastodon development guide](https://github.com/tootsuite/documentation/blob/master/Running-Mastodon/Development-guide.md) is relevant here. In particular, you'll need a recent version of Ruby, Redis, and Postgres running.

Run integration tests, using headless Chrome by default:

    npm test

Run tests for a particular browser:

    BROWSER=chrome npm run test-browser
    BROWSER=chrome:headless npm run test-browser
    BROWSER=firefox npm run test-browser
    BROWSER=firefox:headless npm run test-browser
    BROWSER=safari npm run test-browser
    BROWSER=edge npm run test-browser

## Testing in development mode

In separate terminals:

1\. Run a Mastodon dev server:

    npm run run-mastodon

2\. Run a Pinafore dev server:

    npm run dev

3\. Run a debuggable TestCafé instance:

    npx testcafe --hostname localhost --skip-js-errors --debug-mode firefox tests/spec

If you want to export the current data in the Mastodon instance as canned data, 
so that it can be loaded later, run:

    npm run backup-mastodon-data

## Writing tests

Tests use [TestCafé](https://devexpress.github.io/testcafe/). The tests have a naming convention:

* `0xx-test-name.js`: tests that don't modify the Mastodon database (post, delete, follow, etc.)
* `1xx-test-name.js`: tests that do modify the Mastodon database

In principle the `0-` tests don't have to worry about
clobbering each other, whereas the `1-` ones do.
