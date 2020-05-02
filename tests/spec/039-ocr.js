import {
  extractTextButton,
  getComposeModalNthMediaAltInput,
  getNthMediaFocalPointButton,
  uploadKittenImage
} from '../utils'
import { loginAsFoobar } from '../roles'

fixture`039-ocr.js`
  .page`http://localhost:4002`

test('basic OCR works', async t => {
  await loginAsFoobar(t)
  await uploadKittenImage(1)
  await t.click(getNthMediaFocalPointButton(1))
  await t.click(extractTextButton)
  await t.expect(getComposeModalNthMediaAltInput(1).value).eql('foo', {
    timeout: 30000
  })
})
