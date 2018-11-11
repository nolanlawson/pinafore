#!/usr/bin/env bash

set -e

if [[ "$COMMAND" = deploy-all-travis ]]; then
  exit 0 # no need to setup mastodon in this case
fi

# install ruby
source "$HOME/.rvm/scripts/rvm"
rvm install 2.5.1
rvm use 2.5.1

# fix for redis IPv6 issue
# https://travis-ci.community/t/trusty-environment-redis-server-not-starting-with-redis-tools-installed/650/2
sudo sed -e 's/^bind.*/bind 127.0.0.1/' /etc/redis/redis.conf > redis.conf
sudo mv redis.conf /etc/redis
sudo service redis-server start
echo PING | nc localhost 6379 # check redis running

# install ffmpeg from PPA because it's not in Trusty
sudo -E add-apt-repository -y ppa:mc3man/trusty-media
sudo -E apt-get update
sudo -E apt-get install -y ffmpeg

# check versions
ruby --version
node --version
npm --version
postgres --version
redis-server --version
ffmpeg -version
