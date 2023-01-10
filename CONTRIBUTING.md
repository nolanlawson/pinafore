# Contributing to semaphore

## Installing

To install with dev dependencies, run:

    yarn

## Dev server

To run a dev server with hot reloading:

    yarn run dev

Now it's running at `localhost:4002`.

**Linux users:** for file changes to work,
you'll probably want to run `export CHOKIDAR_USEPOLLING=1`
because of [this issue](https://github.com/paulmillr/chokidar/issues/237).

## Linting

semaphore uses [JavaScript Standard Style](https://standardjs.com/).

Lint:

    yarn run lint

Automatically fix most linting issues:

    yarn run lint-fix

## Integration tests

Integration tests use [TestCafé](https://devexpress.github.io/testcafe/) and a live local Mastodon instance
running on `localhost:3000`.

### Running integration tests

The integration tests require running Mastodon itself,
meaning the [Mastodon development guide](https://docs.joinmastodon.org/dev/setup/)
is relevant here. In particular, you'll need a recent
version of Ruby, Redis, and Postgres running. For a full list of deps, see `bin/setup-mastodon-in-travis.sh`.

Run integration tests, using headless Chrome by default:

    npm test

Run tests for a particular browser:

    BROWSER=chrome yarn run test-browser
    BROWSER=chrome:headless yarn run test-browser
    BROWSER=firefox yarn run test-browser
    BROWSER=firefox:headless yarn run test-browser
    BROWSER=safari yarn run test-browser
    BROWSER=edge yarn run test-browser

If the script isn't able to set up the Postgres database, try running:

    sudo su - postgres

Then:

    psql -d template1 -c "CREATE USER semaphore WITH PASSWORD 'semaphore' CREATEDB;"

### Testing in development mode

In separate terminals:

1\. Run a Mastodon dev server:

    yarn run run-mastodon

2\. Run a Semaphore dev server:

    yarn run dev

3\. Run a debuggable TestCafé instance:

    npx testcafe --debug-mode chrome tests/spec

### Test conventions

The tests have a naming convention:

* `0xx-test-name.js`: tests that don't modify the Mastodon database (read-only)
* `1xx-test-name.js`: tests that do modify the Mastodon database (read-write)

In principle the `0-` tests don't have to worry about
clobbering each other, whereas the `1-` ones do.

### Mastodon used for testing

There are two parts to the Mastodon data used for testing:

1. A Postgres dump and a tgz containing the media files, located in `fixtures`
2. A script that populates the Mastodon backend with test data (`restore-mastodon-data.js`).

The reason we don't use a Postgres dump for everything
is that Mastodon will ignore changes made after a certain period of time, and we
don't want our tests to randomly start breaking one day. Running the script ensures that statuses,
favorites, boosts, etc. are all "fresh".

### Updating the test data

You probably don't want to do this, as the `0xx` tests are pretty rigidly defined against the test data.
Write a `1xx` test instead and insert what you need on-the-fly.

If you really need to, though, you can either:

1. Add new test data to `mastodon-data.js`

or

1. Comment out `await restoreMastodonData()` in `run-mastodon.js`
2. Make your changes manually to the live Mastodon
3. Run the steps in the next section to back it up to `fixtures/`

### Updating the Mastodon version

1. Run `rm -fr mastodon` to clear out all Mastodon data
1. Comment out `await restoreMastodonData()` in `run-mastodon.js` to avoid actually populating the database with statuses/favorites/etc.
2. Update the `GIT_TAG` in `mastodon-config.js` to whatever you want
3. If the Ruby version changed (check Mastodon's `.ruby-version`), install it and update `RUBY_VERSION` in `mastodon-config.js` as well as the Ruby version in `.github/workflows`.
4. Run `yarn run-mastodon`
5. Run `yarn backup-mastodon-data` to overwrite the data in `fixtures/`
6. Uncomment `await restoreMastodonData()` in `run-mastodon.js`
7. Commit all changed files
8. Run `rm -fr mastodon/` and `yarn run run-mastodon` to confirm everything's working

Check `mastodon.log` if you have any issues.

Note that we also run `db:migrate` just to play it safe, but
updating the `fixtures/` should make that a no-op.

## Unit tests

There are also some unit tests that run in Node using Mocha. You can find them in `tests/unit` and
run them using `yarn run test-unit`.

## Debug build

To disable minification in a production build (for debugging purposes), you can run:

    DEBUG=1 yarn build

## Debugging Webpack

The Webpack Bundle Analyzer `report.html` and `stats.json` are available publicly via e.g.:

- [dev.semaphore.social/report.html](https://dev.semaphore.social/report.html)
- [dev.semaphore.social/stats.json](https://dev.semaphore.social/stats.json)

This is also available locally after `yarn run build` at `.sapper/client/report.html`.

## Deploying

This section only applies to `dev.semaphore.social` and `semaphore.social`, not if you're hosting your own version of
Semaphore.

The site uses [Vercel](https://vercel.com). The `master` branch publishes to `dev.semaphore.social` and the `production`
branch deploys to `semaphore.social`.

## Architecture

See [Architecture.md](https://github.com/semaphore-social/semaphore/blob/master/docs/Architecture.md).

## Internationalization

See [Internationalization.md](https://github.com/semaphore-social/semaphore/blob/master/docs/Internationalization.md).

