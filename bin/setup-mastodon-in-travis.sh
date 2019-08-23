#!/usr/bin/env bash

set -e

if [[ "$COMMAND" = deploy-all-travis || "$COMMAND" = test-unit ]]; then
  exit 0 # no need to setup mastodon in this case
fi

# install ruby
source "$HOME/.rvm/scripts/rvm"
rvm install 2.6.1
rvm use 2.6.1

# check versions
ruby --version
node --version
yarn --version
postgres --version
redis-server --version
ffmpeg -version
