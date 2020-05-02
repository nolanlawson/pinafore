import {
  extractTextButton,
  mediaAltInDialog,
  composeInput, getNthMediaEditButton, uploadImage
} from '../utils'
import { loginAsFoobar } from '../roles'
import fs from 'fs'
import path from 'path'
import { RequestMock } from 'testcafe'

fixture`039-ocr.js`
  .page`http://localhost:4002`

// test('basic OCR works', async t => {
//   await loginAsFoobar(t)
//   await t
//      .hover(composeInput)
//      .typeText(composeInput, 'here is some stuff', { paste: true })
//   await uploadKittenImage(1)()
//   await t.click(getNthMediaEditButton(1))
//   await t.click(extractTextButton)
//   await t.expect(mediaAltInDialog.value).eql('foo', {
//     timeout: 30000
//   })
// })

const mock = RequestMock()
  .onRequestTo('http://localhost:4002//eng.traineddata.gz')
  .respond(
    fs.readFileSync(path.join(__dirname, '../../static/eng.traineddata.gz')),
    200,
    {
      'Access-Control-Allow-Origin': '*'
    }
  )

test.requestHooks(mock)('Can do OCR', async t => {
  await loginAsFoobar(t)
  await t
    .hover(composeInput)
    .typeText(composeInput, 'here is some stuff', { paste: true })
  await uploadImage('helloworld.png')()
  await t
    .click(getNthMediaEditButton(1))
    .click(extractTextButton)
    .expect(mediaAltInDialog.value).contains('Hello world', {
      timeout: 45000
    })
})
