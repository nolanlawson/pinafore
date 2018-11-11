#!/usr/bin/env bash

set -e

if [[ "$COMMAND" = deploy-all-travis ]]; then
  exit 0 # no need to setup mastodon in this case
fi

# install ruby
source "$HOME/.rvm/scripts/rvm"
rvm install 2.5.1
rvm use 2.5.1

# install ffmpeg from PPA because it's not in Trusty
sudo -E add-apt-repository -y ppa:mc3man/trusty-media
sudo -E apt-get update
sudo -E apt-get install \
  -yq --no-install-suggests --no-install-recommends \
  autoconf \
  bison \
  build-essential \
  file \
  ffmpeg \
  g++ \
  gcc \
  imagemagick \
  libffi-dev \
  libgdbm-dev \
  libgdbm3 \
  libicu-dev \
  libidn11-dev \
  libncurses5-dev \
  libpq-dev \
  libprotobuf-dev \
  libreadline6-dev \
  libssl-dev \
  libxml2-dev \
  libxslt1-dev \
  libyaml-dev \
  pkg-config nodejs \
  postgresql-10 \
  postgresql-client-10 \
  postgresql-contrib-10 \
  protobuf-compiler \
  redis-server \
  redis-tools \
  zlib1g-dev

# fix for redis IPv6 issue
# https://travis-ci.community/t/trusty-environment-redis-server-not-starting-with-redis-tools-installed/650/2
sudo sed -e 's/^bind.*/bind 127.0.0.1/' /etc/redis/redis.conf > redis.conf
sudo mv redis.conf /etc/redis
sudo service redis-server start
echo PING | nc localhost 6379 # check redis running

# run postgres
sudo service postgresql start 10
pg_isready -p "$PGPORT" # check postgres running

# check versions
ruby --version
node --version
npm --version
postgres --version
redis-server --version
ffmpeg -version
