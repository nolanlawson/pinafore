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

3\. Run a Cypress dev environment:

    npm run cy:open 

If you want to export the current data in the Mastodon instance as canned data, so that it can be loaded later:

    npm run backup-mastodon-data

## Testing

Lint:

    npm run lint

Run Cypress tests:

    npm test