// create the now.json file
// Unfortunately this has to be re-run periodically, as AFAICT there is no way to
// give Zeit a script and tell them to run that, instead of using a static now.json file.

import path from 'path'
import fs from 'fs'
import { promisify } from 'util'
import { routes } from '../__sapper__/service-worker'
import cloneDeep from 'lodash-es/cloneDeep'
import inlineScriptChecksum from '../src/inline-script/checksum'
import { sapperInlineScriptChecksums } from '../src/server/sapperInlineScriptChecksums'

const writeFile = promisify(fs.writeFile)

const JSON_TEMPLATE = {
  'version': 2,
  'env': {
    'NODE_ENV': 'production'
  },
  'builds': [
    {
      'src': 'package.json',
      'use': '@now/static-build',
      'config': {
        'distDir': '__sapper__/export'
      }
    }
  ],
  'routes': [
    {
      'src': '^/service-worker\\.js$',
      'headers': {
        'cache-control': 'public,max-age=0'
      }
    },
    {
      'src': '^/(report\\.html|stats\\.json)$',
      'headers': {
        'cache-control': 'public,max-age=3600'
      },
      'dest': 'client/$1'
    },
    {
      'src': '^/client/.*\\.(js|css|map)$',
      'headers': {
        'cache-control': 'public,max-age=31536000,immutable'
      }
    },
    {
      'src': '^/.*\\.(png|css|json|svg|jpe?g|map|txt)$',
      'headers': {
        'cache-control': 'public,max-age=3600'
      }
    }
  ]
}

const HTML_HEADERS = {
  'cache-control': 'public,max-age=3600',
  'content-security-policy': `script-src 'self' ` +
    `${[inlineScriptChecksum].concat(sapperInlineScriptChecksums).map(_ => `'sha256-${_}'`).join(' ')}; ` +
    `worker-src 'self'; style-src 'self' 'unsafe-inline'; frame-src 'none'; object-src 'none'; manifest-src 'self'`,
  'referrer-policy': 'no-referrer',
  'strict-transport-security': 'max-age=15552000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  'x-download-options': 'noopen',
  'x-frame-options': 'SAMEORIGIN',
  'x-xss-protection': '1; mode=block'
}

async function main () {
  let json = cloneDeep(JSON_TEMPLATE)

  let exportDir = path.resolve(__dirname, '../__sapper__/export')

  for (let { pattern } of routes) {
    let route = {
      src: pattern.source,
      headers: cloneDeep(HTML_HEADERS)
    }

    // remove all the regexy stuff in the regex
    let filename = pattern.source.replace(/^\^\\\//, '').replace(/(\\\/)?\?\$$/, '').replace(/\\\//g, '/')

    // try two different possible paths
    let filePath = [
      `${filename}.html`,
      path.join(filename, 'index.html')
    ].map(_ => path.resolve(exportDir, _)).find(_ => fs.existsSync(_))

    if (!filePath) { // dynamic route, e.g. /accounts/<accountId/
      // serve calls to dynamic routes via the generic "service worker" index.html,
      // since we can't generate the dynamic content using Zeit's static server
      route.dest = 'service-worker-index.html'
    }
    json.routes.push(route)
  }

  // push a generic route to handle everything else
  json.routes.push({
    src: '^/(.*)',
    headers: cloneDeep(HTML_HEADERS)
  })

  await writeFile(path.resolve(__dirname, '../now.json'), JSON.stringify(json, null, '  '), 'utf8')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
