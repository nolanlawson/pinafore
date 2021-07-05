import FormData from 'form-data'
import { auth } from '../src/routes/_api/utils.js'
import * as loadMediaPackage from './loadMedia.cjs'
const { loadMedia } = loadMediaPackage

export async function submitMedia (accessToken, filename, alt) {
  const form = new FormData()
  form.append('file', loadMedia(filename))
  form.append('description', alt)
  return new Promise((resolve, reject) => {
    form.submit({
      host: 'localhost',
      port: 3000,
      path: '/api/v1/media',
      headers: auth(accessToken)
    }, (err, res) => {
      if (err) {
        return reject(err)
      }
      let data = ''

      res.on('data', chunk => {
        data += chunk
      })

      res.on('error', err => {
        console.error(err)
        reject(err)
      })

      res.on('end', () => {
        try {
          const parsed = JSON.parse(data)
          resolve(parsed)
        } catch (err) {
          console.error('Malformed response, expected JSON: ' + data)
          reject(err)
        }
      })
    })
  })
}
