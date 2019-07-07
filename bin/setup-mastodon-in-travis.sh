#!/usr/bin/env bash

set -e

if [[ "$COMMAND" = deploy-all-travis || "$COMMAND" = test-unit ]]; then
  exit 0 # no need to setup mastodon in this case
fi

# install ruby
source "$HOME/.rvm/scripts/rvm"
rvm install 2.6.1
rvm use 2.6.1

# setup postgres user in Travis
psql -d template1 -h 127.0.0.1 -p 5433 -c -U postgres "CREATE USER pinafore WITH PASSWORD 'pinafore' CREATEDB;"

echo PING | nc localhost 6379 # check redis running

# check versions
ruby --version
node --version
yarn --version
postgres --version
redis-server --version
ffmpeg -version
