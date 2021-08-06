# Breaking changes

This document contains a list of _breaking changes_ for Pinafore. For a full changelog, see [GitHub releases](https://github.com/nolanlawson/pinafore/releases).

## 2.0.0

For self-hosters, the new minimum Node.js versions are v12.20+, v14.14+, or v16.0+ [due to native ES Modules](https://github.com/nolanlawson/pinafore/pull/2064).

Please check your Node version using `node --version` and update as necessary.

## 1.0.0

This version [switches Pinafore from npm to yarn](https://github.com/nolanlawson/pinafore/pull/927). Those who self-host Pinafore will need to make the following changes:

1. [Install yarn](https://yarnpkg.com/en/docs/install) if you haven't already.
2. Instead of `npm install`, run `yarn --pure-lockfile`.

This change fixes [a functional bug in Webpack](https://github.com/nolanlawson/pinafore/pull/926). If you use npm instead of yarn, Pinafore may not build correctly.

### Notes:

- Using `yarn start` instead of `npm start` should not make a difference.
- Those using Docker shouldn't need to change anything.
