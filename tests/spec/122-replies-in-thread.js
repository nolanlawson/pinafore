import { loginAsFoobar } from '../roles'
import {
  getNthStatus,
  getNthStatusContent,
  getUrl,
  getNthReplyButton, getNthComposeReplyInput, sleep,
  getAriaSetSize,
  getNthComposeReplyButton, goBack, goForward
} from '../utils'
import { postAs, postReplyAs } from '../serverActions'

fixture`122-replies-in-threads.js`
  .page`http://localhost:4002`

const TIMEOUT = 1500

async function goBackAndForward (t) {
  await goBack()
  await t.expect(getUrl()).eql('http://localhost:4002/')
  await goForward()
  await t.expect(getUrl()).match(/statuses/)
}

async function verifyAriaSetSize (t, size) {
  await sleep(TIMEOUT)
  await t.expect(getAriaSetSize()).eql(size)
  await goBackAndForward(t)
  await sleep(TIMEOUT)
  await t.expect(getAriaSetSize()).eql(size)
}

// You click on status B, which is a reply to status A.
// Now status C comes in, which is a response to status A.
// Status C is inserted automatically, even though it shouldn't be in that thread.
test('reply to non-focused parent status in a thread', async t => {
  const { id } = await postAs('admin', 'here is my awesome thread')
  await postReplyAs('admin', 'and here it is continued', id)
  await loginAsFoobar(t)
  await t
    .hover(getNthStatus(0))
    .expect(getNthStatusContent(0).innerText).contains('and here it is continued')
    .click(getNthStatus(0))
    .expect(getUrl()).match(/statuses/)
    .click(getNthReplyButton(0))
    .typeText(getNthComposeReplyInput(0), 'haha I totally agree', { paste: true })
    .click(getNthComposeReplyButton(0))
  await verifyAriaSetSize(t, '2')
})

// In this case it's the same as the previous, except the focused status is status A.
test('reply to focused status in a thread', async t => {
  const { id } = await postAs('admin', 'whoa here is my other awesome thread')
  await postReplyAs('admin', 'whoa and here it is probably continued', id)
  await loginAsFoobar(t)
  await t
    .hover(getNthStatus(0))
    .expect(getNthStatusContent(0).innerText).contains('whoa and here it is probably continued')
    .hover(getNthStatusContent(1))
    .click(getNthStatus(1))
    .expect(getUrl()).match(/statuses/)
    .click(getNthReplyButton(0))
    .typeText(getNthComposeReplyInput(0), 'haha I totally agree', { paste: true })
    .click(getNthComposeReplyButton(0))
  await verifyAriaSetSize(t, '3')
})

// In this case the thread is A-B-C, the focused status is C,
// and the replied-to status is A.
test('reply to non-focused grandparent status in a thread', async t => {
  const { id: id1 } = await postAs('admin', 'cool thread 1/3')
  const { id: id2 } = await postReplyAs('admin', 'cool thread 2/3', id1)
  await postReplyAs('admin', 'cool thread 3/3', id2)
  await loginAsFoobar(t)
  await t
    .hover(getNthStatus(0))
    .expect(getNthStatusContent(0).innerText).contains('cool thread 3/3')
    .click(getNthStatus(0))
    .expect(getUrl()).match(/statuses/)
    .hover(getNthStatus(2))
    .hover(getNthStatus(1))
    .hover(getNthStatus(0))
    .click(getNthReplyButton(0))
    .typeText(getNthComposeReplyInput(0), 'this is sweet', { paste: true })
    .click(getNthComposeReplyButton(0))
  await verifyAriaSetSize(t, '3')
})

// Thread is A-B-C, focused status is A, replied-to status is C.
test('reply to non-focused grandchild status in a thread', async t => {
  const { id: id1 } = await postAs('admin', 'sweet thread 1/3')
  const { id: id2 } = await postReplyAs('admin', 'sweet thread 2/3', id1)
  await postReplyAs('admin', 'sweet thread 3/3', id2)
  await loginAsFoobar(t)
  await t
    .hover(getNthStatus(0))
    .expect(getNthStatusContent(0).innerText).contains('sweet thread 3/3')
    .hover(getNthStatusContent(1))
    .hover(getNthStatus(2))
    .click(getNthStatus(2))
    .expect(getUrl()).match(/statuses/)
    .hover(getNthStatus(0))
    .hover(getNthStatus(1))
    .hover(getNthStatus(2))
    .click(getNthReplyButton(2))
    .typeText(getNthComposeReplyInput(2), 'this is sweet', { paste: true })
    .click(getNthComposeReplyButton(2))
  await verifyAriaSetSize(t, '4')
})
