#!/usr/bin/env bash

set -e
set -x

if [ "$TRAVIS_BRANCH" = master -a "$TRAVIS_PULL_REQUEST" = false ]; then
  yarn run deploy-dev
fi
