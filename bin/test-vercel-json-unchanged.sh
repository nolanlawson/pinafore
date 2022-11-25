#!/usr/bin/env bash

# In CI, we need to make sure the vercel.json file is built correctly,
# or else it will mess up the deployment to Vercel

if ! diff -q /tmp/vercel-old.json ./vercel.json &>/dev/null; then
  diff /tmp/vercel-old.json ./vercel.json
  echo "vercel.json changed, run yarn build and make sure everything looks okay"
  exit 1
fi
