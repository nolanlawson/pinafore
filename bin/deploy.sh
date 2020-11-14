#!/usr/bin/env bash

set -e
set -x

PATH="$PATH:./node_modules/.bin"

# need to build to update vercel.json
yarn run build

# set up robots.txt
if [[ "$DEPLOY_TYPE" == "dev" ]]; then
  printf 'User-agent: *\nDisallow: /' > static/robots.txt
else
  rm -f static/robots.txt
fi

# if in travis, use the $VERCEL_TOKEN
DEPLOY_COMMAND="vercel --scope nolanlawson"
if [[ ! -z "$VERCEL_TOKEN" ]]; then
  DEPLOY_COMMAND="$DEPLOY_COMMAND --token $VERCEL_TOKEN"
fi

# launch
URL=$($DEPLOY_COMMAND --confirm -e SAPPER_TIMESTAMP=$(date +%s%3N))

# fixes issues with now being unavailable immediately
sleep 60

# choose the right alias
DEPLOY_ALIAS="dev.pinafore.social"

if [[ "$DEPLOY_TYPE" == "prod" ]]; then
  DEPLOY_ALIAS="pinafore.social"
fi

# alias
$DEPLOY_COMMAND alias "$URL" "$DEPLOY_ALIAS"

# cleanup
$DEPLOY_COMMAND rm pinafore --safe --yes
