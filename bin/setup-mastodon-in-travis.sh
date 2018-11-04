#!/usr/bin/env bash

set -e

if [[ "$COMMAND" = deploy-dev-travis ]]; then
  exit 0 # no need to setup mastodon in this case
fi

# install ruby
source "$HOME/.rvm/scripts/rvm"
rvm install 2.5.1
rvm use 2.5.1

# build redis from source until this is fixed: https://git.io/fxjkb
curl -O http://download.redis.io/redis-stable.tar.gz
tar -xzf redis-stable.tar.gz
cd redis-stable
make
sudo make install
redis-server --daemonize yes

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
