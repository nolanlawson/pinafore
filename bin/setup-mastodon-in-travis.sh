#!/usr/bin/env bash

set -e

if [[ "$COMMAND" = deploy-all-travis || "$COMMAND" = test-unit ]]; then
  exit 0 # no need to setup mastodon in this case
fi

# install ruby
source "$HOME/.rvm/scripts/rvm"
rvm install 2.5.3
rvm use 2.5.3

# fix for redis IPv6 issue
# https://travis-ci.community/t/trusty-environment-redis-server-not-starting-with-redis-tools-installed/650/2
sudo sed -e 's/^bind.*/bind 127.0.0.1/' /etc/redis/redis.conf > redis.conf
sudo mv redis.conf /etc/redis
sudo service redis-server start
echo PING | nc localhost 6379 # check redis running

# install ffmpeg because it's not in Trusty
if [ ! -f /home/travis/ffmpeg-static/ffmpeg ]; then
  rm -fr /home/travis/ffmpeg-static
  mkdir -p /home/travis/ffmpeg-static
  curl -sL \
    -A 'https://github.com/nolanlawson/pinafore' \
    -o ffmpeg.tar.xz \
    'https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-64bit-static.tar.xz'
  tar -x -C /home/travis/ffmpeg-static --strip-components 1 -f ffmpeg.tar.xz --wildcards '*/ffmpeg' --wildcards '*/ffprobe'
fi
sudo ln -s /home/travis/ffmpeg-static/ffmpeg /usr/local/bin/ffmpeg
sudo ln -s /home/travis/ffmpeg-static/ffprobe /usr/local/bin/ffprobe

# check versions
ruby --version
node --version
npm --version
postgres --version
redis-server --version
ffmpeg -version
