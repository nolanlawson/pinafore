import {
  getNthStatus, getUrl, goBack,
  sleep
} from '../utils'
import { loginAsFoobar } from '../roles'
import { postAs, putAs } from '../serverActions'

fixture`140-editing.js`
  .page`http://localhost:4002`

test('Edited toots are updated in the UI', async t => {
  const { id: statusId } = await postAs('admin', 'yolo')
  await sleep(500)

  await loginAsFoobar(t)
  await t.expect(getNthStatus(1).innerText).contains('yolo', { timeout: 20000 })

  await putAs('admin', 'wait I mean YOLO', statusId)
  await sleep(500)

  await t.click(getNthStatus(1))
    .expect(getUrl()).contains('/statuses')
    .expect(getNthStatus(1).innerText).contains('wait I mean YOLO', { timeout: 20000 })
  await goBack()
  await t
    .expect(getUrl()).eql('http://localhost:4002/')
    .expect(getNthStatus(1).innerText).contains('wait I mean YOLO', { timeout: 20000 })
})
