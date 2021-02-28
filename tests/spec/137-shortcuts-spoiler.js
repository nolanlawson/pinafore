import {
  getNthStatus, getNthStatusContent, getNthStatusSpoiler, getUrl, sleep
} from '../utils'
import { loginAsFoobar } from '../roles'
import { postReplyWithSpoilerAs, postWithSpoilerAndPrivacyAs } from '../serverActions'

fixture`137-shortcut-spoiler.js`
  .page`http://localhost:4002`

test('Can toggle all spoilers with shortcut', async t => {
  const { id: statusId1 } = await postWithSpoilerAndPrivacyAs('admin', 'the content', 'yolo', 'public')
  const { id: statusId2 } = await postReplyWithSpoilerAs('admin', 'the content', statusId1, 'haha')
  await postReplyWithSpoilerAs('admin', 'the content', statusId2, 'wheeee')
  await sleep(500)
  await loginAsFoobar(t)
  await t
    .expect(getNthStatusSpoiler(1).innerText).eql('wheeee')
    .click(getNthStatus(1))
    .expect(getUrl()).contains('/statuses')
    .expect(getNthStatusSpoiler(1).innerText).eql('yolo')
    .expect(getNthStatusSpoiler(2).innerText).eql('haha')
    .expect(getNthStatusSpoiler(3).innerText).eql('wheeee')
    .expect(getNthStatusContent(1).visible).notOk()
    .expect(getNthStatusContent(2).visible).notOk()
    .expect(getNthStatusContent(3).visible).notOk()
  await sleep(500)
  await t
    .pressKey('z')
    .expect(getNthStatusContent(1).innerText).contains('the content')
    .expect(getNthStatusContent(2).innerText).contains('the content')
    .expect(getNthStatusContent(3).innerText).contains('the content')
    .expect(getNthStatusContent(1).visible).ok()
    .expect(getNthStatusContent(2).visible).ok()
    .expect(getNthStatusContent(3).visible).ok()
  await sleep(500)
  await t
    .pressKey('z')
    .expect(getNthStatusContent(1).visible).notOk()
    .expect(getNthStatusContent(2).visible).notOk()
    .expect(getNthStatusContent(3).visible).notOk()
})
