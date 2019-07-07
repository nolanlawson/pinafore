#!/usr/bin/env bash

set -e

if [[ "$COMMAND" = deploy-all-travis || "$COMMAND" = test-unit ]]; then
  exit 0 # no need to setup mastodon in this case
fi

# install ruby
source "$HOME/.rvm/scripts/rvm"
rvm install 2.6.1
rvm use 2.6.1

# fix for redis IPv6 issue
# https://travis-ci.community/t/trusty-environment-redis-server-not-starting-with-redis-tools-installed/650/2
sudo sed -e 's/^bind.*/bind 127.0.0.1/' /etc/redis/redis.conf > redis.conf
sudo mv redis.conf /etc/redis
sudo service redis-server start
echo PING | nc localhost 6379 # check redis running

# check versions
ruby --version
node --version
yarn --version
postgres --version
redis-server --version
ffmpeg -version
