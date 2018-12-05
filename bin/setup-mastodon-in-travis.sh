#!/usr/bin/env bash

set -e

if [[ "$COMMAND" = deploy-all-travis || "$COMMAND" = test-unit ]]; then
  exit 0 # no need to setup mastodon in this case
fi

# install ruby
source "$HOME/.rvm/scripts/rvm"
rvm install 2.5.3
rvm use 2.5.3

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

# check versions
ruby --version
node --version
npm --version
postgres --version
redis-server --version
ffmpeg -version
