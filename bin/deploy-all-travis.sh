#!/usr/bin/env bash

set -e
set -x

if [ "$TRAVIS_BRANCH" = master -a "$TRAVIS_PULL_REQUEST" = false ]; then
  npm run deploy-dev
fi
