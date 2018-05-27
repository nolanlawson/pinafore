#!/usr/bin/env bash

set -e
set -x

if [[ "$COMMAND" = deploy-dev-travis ]]; then
  exit 0 # no need to setup mastodon in this case
fi

sudo -E add-apt-repository -y ppa:mc3man/trusty-media
sudo -E apt-get update
sudo -E apt-get install -y autoconf bison build-essential ffmpeg file \
  g++ gcc imagemagick libffi-dev libgdbm-dev libgdbm3 libicu-dev \
  libidn11-dev libncurses5-dev libpq-dev libprotobuf-dev libreadline6-dev \
  libssl-dev libxml2-dev libxslt1-dev libyaml-dev nodejs \
  postgresql-10 postgresql-client-10 postgresql-contrib-10 pkg-config \
  protobuf-compiler redis-tools zlib1g-dev

ruby --version
node --version
npm --version
postgres --version
redis-server --version
ffmpeg -version
