const fs = require('fs')
const path = require('path')

const checksum = require('../inline-script-checksum').checksum
const html = fs.readFileSync(path.join(__dirname, '../__sapper__/export/index.html'), 'utf8')
const nonce = html.match(/<script nonce=([^>]+)>/)[1]

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

Serve, and add this CSP header to your nginx config:

    add_header Content-Security-Policy "script-src 'self' 'sha256-${checksum}' 'nonce-${nonce}'; worker-src 'self'; style-src 'self' 'unsafe-inline'; frame-src 'none'; object-src 'none'; manifest-src 'self'"

Enjoy Pinafore!
`)
