# Contributing to Pinafore

## Dev server

To run a dev server with hot reloading:

    npm run dev

Now it's running at `localhost:4002`.

**Linux users:** for file changes to work, 
you'll probably want to run `export CHOKIDAR_USEPOLLING=1`
because of [this issue](https://github.com/paulmillr/chokidar/issues/237).

## Linting

Pinafore uses [JavaScript Standard Style](https://standardjs.com/).

Lint:

    npm run lint

Automatically fix most linting issues:

    npm run lint-fix

## Integration tests

Integration tests use [TestCafé](https://devexpress.github.io/testcafe/) and a live local Mastodon instance
running on `localhost:3000`.

### Running integration tests

The integration tests require running Mastodon itself,
meaning the[Mastodon development guide](https://github.com/tootsuite/documentation/blob/master/Running-Mastodon/Development-guide.md)
is relevant here. In particular, you'll need a recent 
version of Ruby, Redis, and Postgres running. For a full list of deps, see `bin/setup-mastodon-in-travis.sh`.

Run integration tests, using headless Chrome by default:

    npm test

Run tests for a particular browser:

    BROWSER=chrome npm run test-browser
    BROWSER=chrome:headless npm run test-browser
    BROWSER=firefox npm run test-browser
    BROWSER=firefox:headless npm run test-browser
    BROWSER=safari npm run test-browser
    BROWSER=edge npm run test-browser

If the script isn't able to set up the Postgres database, try running:

    sudo su - postgres

Then:

    psql -d template1 -c "CREATE USER pinafore WITH PASSWORD 'pinafore' CREATEDB;"

### Testing in development mode

In separate terminals:

1\. Run a Mastodon dev server:

    npm run run-mastodon

2\. Run a Pinafore dev server:

    npm run dev

3\. Run a debuggable TestCafé instance:

    npx testcafe --hostname localhost --skip-js-errors --debug-mode chrome tests/spec

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
2. Update the `GIT_TAG` in `run-mastodon.js` to whatever you want
3. Run `npm run run-mastodon`
4. Run `npm run backup-mastodon-data` to overwrite the data in `fixtures/`
5. Uncomment `await restoreMastodonData()` in `run-mastodon.js`
6. Commit all changed files
7. Run `rm -fr mastodon/` and `npm run run-mastodon` to confirm everything's working

Check `mastodon.log` if you have any issues.

## Unit tests

There are also some unit tests that run in Node using Mocha. You can find them in `tests/unit` and
run them using `npm run test-unit`.

## Debugging Webpack

The Webpack Bundle Analyzer `report.html` and `stats.json` are available publicly via e.g.:

- [dev.pinafore.social/report.html](https://dev.pinafore.social/report.html)
- [dev.pinafore.social/stats.json](https://dev.pinafore.social/stats.json)

This is also available locally after `npm run build` at `.sapper/client/report.html`.

## Codebase overview

Pinafore uses [SvelteJS](https://svelte.technology) and [SapperJS](https://sapper.svelte.technology). Most of it is a fairly typical Svelte/Sapper project, but there
are some quirks, which are described below. This list of quirks is non-exhaustive.

### Prebuild process

The `template.html` is itself templated. The "template template" has some inline scripts, CSS, and SVGs
injected into it during the build process. SCSS is used for global CSS and themed CSS, but inside of the
components themselves, it's just vanilla CSS because I couldn't figure out how to get Svelte to run a SCSS
preprocessor.

### Lots of small files

Highly modular, highly functional, lots of single-function files. Tends to help with tree-shaking and
code-splitting, as well as avoiding circular dependencies.

### Inferno is loaded dynamically

This is a Svelte project, but `emoji-mart` is used for the emoji picker, and it's written in React. So we
lazy-load the React-compatible Inferno library when we load `emoji-mart`.

### Some third-party code is bundled

For various reasons, `a11y-dialog`, `autosize`, and `timeago` are forked and bundled into the source code.
This was either because something needed to be tweaked or fixed, or I was trimming unused code and didn't
see much value in contributing it back, because it was too Pinafore-specific.

### Every Sapper page is "duplicated"

To get a nice animation on the nav bar when you switch columns, every page is lazy-loaded as `LazyPage.html`.
This "lazy page" is merely delayed a few frames to let the animation run. Therefore there is a duplication
between `src/routes` and `src/routes/_pages`. The "lazy page" is in the former, and the actual page is in the
latter. One imports the other.

### There are multiple stores

Originally I conceived of separating out the virtual list into a separate npm package, so I gave it its
own Svelte store (`virtualListStore.js`). This never happened, but it still has its own store. This is useful
anyway, because each store has its state maintained in an LRU cache that allows us to keep the scroll position
in the virtual list e.g. when the user hits the back button.

Also, the main `store.js` store is explicitly
loaded by every component that uses it. So there's no `store` inheritance; every component just declares
whatever store it uses. The main `store.js` is the primary one.

### There is a global event bus

It's in `eventBus.js`. This is useful for some stuff that is hard to do with standard Svelte or DOM events.
