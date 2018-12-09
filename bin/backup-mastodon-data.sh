#!/usr/bin/env bash

set -x
set -e

PGPASSWORD=pinafore pg_dump -U pinafore -w pinafore_development > fixtures/dump.sql
cd mastodon/public/system
tar -czf ../../../fixtures/system.tgz .
