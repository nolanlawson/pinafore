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

    yarn run dev

Now it's running at `localhost:4002`.

## Linting

Pinafore uses [JavaScript Standard Style](https://standardjs.com/).

Lint:

    yarn run lint

Automatically fix most linting issues:

    yarn run lint-fix

## Testing

Testing requires running Mastodon itself, meaning the [Mastodon development guide](https://github.com/tootsuite/documentation/blob/master/Running-Mastodon/Development-guide.md) is relevant here. In particular, you'll need a recent version of Ruby, Redis, and Postgres running.

Run integration tests, using headless Chrome by default:

    yarn test

Run tests for a particular browser:

    BROWSER=chrome yarn run test-browser
    BROWSER=chrome:headless yarn run test-browser
    BROWSER=firefox yarn run test-browser
    BROWSER=firefox:headless yarn run test-browser
    BROWSER=safari yarn run test-browser
    BROWSER=edge yarn run test-browser

## Testing in development mode

In separate terminals:

1\. Run a Mastodon dev server:

    yarn run run-mastodon

2\. Run a Pinafore dev server:

    yarn run dev

3\. Run a debuggable TestCafé instance:

    npx testcafe --hostname localhost --skip-js-errors --debug-mode firefox tests/spec

If you want to export the current data in the Mastodon instance as canned data, 
so that it can be loaded later, run:

    yarn run backup-mastodon-data

## Writing tests

Tests use [TestCafé](https://devexpress.github.io/testcafe/). The tests have a naming convention:

* `0xx-test-name.js`: tests that don't modify the Mastodon database (post, delete, follow, etc.)
* `1xx-test-name.js`: tests that do modify the Mastodon database

In principle the `0-` tests don't have to worry about
clobbering each other, whereas the `1-` ones do.

## Debugging Webpack

The Webpack Bundle Analyzer `report.html` and `stats.json` are available publicly via e.g.:

- [dev.pinafore.social/report.html](https://dev.pinafore.social/report.html)
- [dev.pinafore.social/stats.json](https://dev.pinafore.social/stats.json)

This is also available locally after `yarn run build` at `.sapper/client/report.html`.

## Updating Mastodon used for testing

1. Run `rm -fr mastodon` to clear out all Mastodon data
1. Comment out `await restoreMastodonData()` in `run-mastodon.js` to avoid actually populating the database with statuses/favorites/etc.
2. Update the `GIT_TAG` in `run-mastodon.js` to whatever you want
3. Run `yarn run run-mastodon`
4. Run `yarn run backup-mastodon-data` to overwrite the data in `fixtures/`
5. Uncomment `await restoreMastodonData()` in `run-mastodon.js`
6. Commit all changed files
7. Run `rm -fr mastodon/` and `yarn run run-mastodon` to confirm everything's working

Check `mastodon.log` if you have any issues.