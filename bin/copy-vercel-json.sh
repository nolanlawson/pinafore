#!/usr/bin/env bash

# Designed to be run before yarn build, and then tested with test-vercel-json-unchanged.sh

cp ./vercel.json /tmp/vercel-old.json
