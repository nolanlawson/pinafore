import FormData from 'form-data'
import fs from 'fs'
import path from 'path'
import { auth } from '../src/routes/_api/utils'

export async function submitMedia (accessToken, filename, alt) {
  let form = new FormData()
  form.append('file', fs.createReadStream(path.join(__dirname, 'images', filename)))
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

      res.on('end', () => resolve(JSON.parse(data)))
    })
  })
}
