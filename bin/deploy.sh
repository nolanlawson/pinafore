#!/usr/bin/env bash

set -e
set -x

PATH="$PATH:./node_modules/.bin"

# set up robots.txt
if [[ "$DEPLOY_TYPE" == "dev" ]]; then
  printf 'User-agent: *\nDisallow: /' > static/robots.txt
else
  rm -f static/robots.txt
fi

# if in travis, use the $NOW_TOKEN
NOW_COMMAND="now --team nolanlawson"
if [[ ! -z "$NOW_TOKEN" ]]; then
  NOW_COMMAND="$NOW_COMMAND --token $NOW_TOKEN"
fi

# launch
URL=$($NOW_COMMAND -e SAPPER_TIMESTAMP=$(date +%s%3N))

# fixes issues with now being unavailable immediately
sleep 60

# choose the right alias
NOW_ALIAS="dev.pinafore.social"

if [[ "$DEPLOY_TYPE" == "prod" ]]; then
  NOW_ALIAS="pinafore.social"
fi

# alias
$NOW_COMMAND alias "$URL" "$NOW_ALIAS"

# cleanup
$NOW_COMMAND rm pinafore --safe --yes
