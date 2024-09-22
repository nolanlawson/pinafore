#!/usr/bin/env bash

yarn
IS_CLOUDFLARE=1 yarn build
cp _headers __sapper__/export/
cd __sapper__/export
rm -f /tmp/pinafore.zip
zip -r /tmp/pinafore.zip *
