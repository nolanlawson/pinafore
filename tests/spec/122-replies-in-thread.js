import { loginAsFoobar } from '../roles'
import {
  getNthStatus,
  getNthStatusContent,
  getUrl,
  getNthReplyButton,
  getNthComposeReplyInput,
  sleep,
  getAriaSetSize,
  getNthComposeReplyButton,
  goBack,
  goForward,
  composeInput,
  composeButton,
  getNthStatusId,
  getStatusContents
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
    .hover(getNthStatus(1))
    .expect(getNthStatusContent(1).innerText).contains('and here it is continued')
    .click(getNthStatus(1))
    .expect(getUrl()).match(/statuses/)
    .click(getNthReplyButton(1))
    .typeText(getNthComposeReplyInput(1), 'haha I totally agree', { paste: true })
    .click(getNthComposeReplyButton(1))
  await verifyAriaSetSize(t, '2')
})

// In this case it's the same as the previous, except the focused status is status A.
test('reply to focused status in a thread', async t => {
  const { id } = await postAs('admin', 'whoa here is my other awesome thread')
  await postReplyAs('admin', 'whoa and here it is probably continued', id)
  await loginAsFoobar(t)
  await t
    .hover(getNthStatus(1))
    .expect(getNthStatusContent(1).innerText).contains('whoa and here it is probably continued')
    .hover(getNthStatusContent(2))
    .click(getNthStatus(2))
    .expect(getUrl()).match(/statuses/)
    .click(getNthReplyButton(1))
    .typeText(getNthComposeReplyInput(1), 'haha I totally agree', { paste: true })
    .click(getNthComposeReplyButton(1))
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
    .hover(getNthStatus(1))
    .expect(getNthStatusContent(1).innerText).contains('cool thread 3/3')
    .click(getNthStatus(1))
    .expect(getUrl()).match(/statuses/)
    .hover(getNthStatus(3))
    .hover(getNthStatus(2))
    .hover(getNthStatus(1))
    .click(getNthReplyButton(1))
    .typeText(getNthComposeReplyInput(1), 'this is sweet', { paste: true })
    .click(getNthComposeReplyButton(1))
  await verifyAriaSetSize(t, '3')
})

// Thread is A-B-C, focused status is A, replied-to status is C.
test('reply to non-focused grandchild status in a thread', async t => {
  const { id: id1 } = await postAs('admin', 'sweet thread 1/3')
  const { id: id2 } = await postReplyAs('admin', 'sweet thread 2/3', id1)
  await postReplyAs('admin', 'sweet thread 3/3', id2)
  await loginAsFoobar(t)
  await t
    .hover(getNthStatus(1))
    .expect(getNthStatusContent(1).innerText).contains('sweet thread 3/3')
    .hover(getNthStatusContent(2))
    .hover(getNthStatus(3))
    .click(getNthStatus(3))
    .expect(getUrl()).match(/statuses/)
    .hover(getNthStatus(1))
    .hover(getNthStatus(2))
    .hover(getNthStatus(3))
    .click(getNthReplyButton(3))
    .typeText(getNthComposeReplyInput(3), 'this is sweet', { paste: true })
    .click(getNthComposeReplyButton(3))
  await verifyAriaSetSize(t, '4')
})

async function replyToNthStatus (t, n, replyText, expectedN) {
  await t
    .click(getNthReplyButton(n))
    .typeText(getNthComposeReplyInput(n), replyText, { paste: true })
    .click(getNthComposeReplyButton(n))
    .expect(getNthStatusContent(expectedN).innerText).contains(replyText)
}

test('no duplicates in threads', async t => {
  await loginAsFoobar(t)
  await t
    .hover(composeInput)
    .typeText(composeInput, 'this is my thread 1', { paste: true })
    .click(composeButton)
    .expect(getNthStatusContent(1).innerText).contains('this is my thread 1')
    .click(getNthStatus(1))
    .expect(getUrl()).contains('status')
  await replyToNthStatus(t, 1, 'this is my thread 2', 2)
  const [id1, id2] = await Promise.all([getNthStatusId(1)(), getNthStatusId(2)()])
  await t
    .click(getNthStatus(2))
    .expect(getUrl()).contains(id2)
  await replyToNthStatus(t, 2, 'this is my thread 3', 3)
  const id3 = await getNthStatusId(3)()
  await postReplyAs('quux', 'hey i am replying to 1', id1)
  await postReplyAs('admin', 'hey i am replying to 3', id3)
  await t
    .expect(getNthStatusContent(4).innerText).contains('hey i am replying to 3', { timeout: 20000 })
  const idReplyTo3 = await getNthStatusId(4)()
  await t
    .click(getNthStatus(4))
    .expect(getUrl()).contains(idReplyTo3)
  await postReplyAs('quux', 'hey check this reply', id1)
  await t
    .click(getNthStatus(2))
    .expect(getUrl()).contains(id2)
    .click(getNthStatus(3))
    .expect(getUrl()).contains(id3)
  await replyToNthStatus(t, 3, 'this is my thread 4', 5)
  await replyToNthStatus(t, 5, 'this is my thread 5', 6)
  const id5 = await getNthStatusId(6)()
  await postReplyAs('admin', 'hey i am replying to 1 again', id1)
  await t
    .expect(getNthStatusContent(6).innerText).contains('this is my thread 5')
    .click(getNthStatus(6))
    .expect(getUrl()).contains(id5)
    .click(getNthStatus(1))
    .expect(getUrl()).contains(id1)
    .expect(getNthStatusContent(5).innerText).contains('this is my thread 5')
    .click(getNthStatus(5))
    .expect(getUrl()).contains(id5)
  await replyToNthStatus(t, 5, 'this is my thread 6', 6)
  await t
    .click(getNthStatus(1))
    .expect(getUrl()).contains(id1)

  const contents = await getStatusContents()
  const contentsToCounts = new Map()
  for (const content of contents) {
    contentsToCounts.set(content, 1 + (contentsToCounts.get(content) || 0))
  }
  const duplicates = [...contentsToCounts.entries()].filter(arr => arr[1] > 1).map(arr => arr[0])

  // there should be no duplicates
  await t
    .expect(duplicates).eql([])
})
