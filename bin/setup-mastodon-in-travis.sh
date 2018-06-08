#!/usr/bin/env bash

set -e

if [[ "$COMMAND" = deploy-dev-travis ]]; then
  exit 0 # no need to setup mastodon in this case
fi

source "$HOME/.rvm/scripts/rvm"
rvm install 2.5.1
rvm use 2.5.1

sudo -E add-apt-repository -y ppa:mc3man/trusty-media
sudo -E apt-get update
sudo -E apt-get install -y ffmpeg
ruby --version
node --version
npm --version
postgres --version
redis-server --version
ffmpeg -version
