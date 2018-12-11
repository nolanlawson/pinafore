const fs = require('fs')
const path = require('path')

const checksum = require('../inline-script-checksum').checksum
const html = fs.readFileSync(path.join(__dirname, '../__sapper__/export/index.html'), 'utf8')
const nonce = html.match(/<script nonce=([^>]+)>/)[1]

const csp = `add_header Content-Security-Policy "script-src 'self' 'sha256-${checksum}' 'nonce-${nonce}'; ` +
`worker-src 'self'; style-src 'self' 'unsafe-inline'; frame-src 'none'; object-src 'none'; manifest-src 'self';`

fs.writeFileSync(path.join(__dirname, '../__sapper__/export/.csp.nginx'), csp, 'utf8')

console.log(`                                                                                             

               ,((*
               ,((*   (,
               ,((*   (((*
               ,((*   (((((.
            *  ,((*   ((((((*
          .(/  ,((*   (((((((/
         .((/  ,((*   ((((((((/
        ,(((/  ,((*   (((((((((*
      .(((((/  ,((*   ((((((((((
               ,((*
     //////////((((/////////////
     /((((((((((((((((((((((((((
      /((((((((((((((((((((((((,
       *(((((((((((((((((((((/.
         ./((((((((((((((((.


           P I N A F O R E


Export successful! Static files are in:

    __sapper__/export/

Be sure to add the CSP header to your nginx config:

    server {
        include ${path.resolve(__dirname, '..')}/__sapper__/export/.csp.nginx;
    }

This file will be updated whenever you do \`npm run export\`.

Enjoy Pinafore!
`)
