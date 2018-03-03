import fs from 'fs'
import path from 'path'

export const kitten1 = {
  data: fs.readFileSync(path.join(__dirname, './images/kitten1.jpg')).toString('base64'),
  name: 'kitten1.jpg'
}

export const kitten2 = {
  data: fs.readFileSync(path.join(__dirname, './images/kitten2.jpg')).toString('base64'),
  name: 'kitten2.jpg'
}

export const kitten3 = {
  data: fs.readFileSync(path.join(__dirname, './images/kitten3.jpg')).toString('base64'),
  name: 'kitten3.jpg'
}

export const kitten4 = {
  data: fs.readFileSync(path.join(__dirname, './images/kitten4.jpg')).toString('base64'),
  name: 'kitten4.jpg'
}
