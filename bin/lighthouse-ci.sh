#!/usr/bin/env bash

set -e
set -x

PATH="$PATH:./node_modules/.bin"

lighthouse-ci \
  --perf=85 \
  --pwa=60 \
  --a11y=90 \
  --bp=90 \
  --seo=85 \
  --no-comment \
  'https://staging.pinafore.social/settings/quick-login?instanceName=localhost:3000&accessToken=b48d72074a467e77a18eafc0d52e373dcf2492bcb3fefadc302a81300ec69002'
