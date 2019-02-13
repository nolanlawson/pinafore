#!/usr/bin/env node

process.env.PORT = process.env.PORT || 4002

require('./__sapper__/build')
