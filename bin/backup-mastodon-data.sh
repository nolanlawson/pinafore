#!/usr/bin/env bash

set -x
set -e

PGPASSWORD=semaphore pg_dump -U semaphore -w semaphore_development -h 127.0.0.1 > tests/fixtures/dump.sql
cd mastodon/public/system
tar -czf ../../../tests/fixtures/system.tgz .
