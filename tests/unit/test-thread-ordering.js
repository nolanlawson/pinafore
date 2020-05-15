import assert from 'assert'
import {sortItemSummariesForThread} from '../../src/routes/_utils/sortItemSummariesForThread';

describe('test-thread-ordering.js', () => {
  it('orders a complex thread correctly', () => {
    const summaries = [
      {
        "id": "104170273205084988",
        "accountId": "2",
        "content": "a"
      },
      {
        "id": "104170273237400789",
        "accountId": "5",
        "replyId": "104170273205084988",
        "content": "b"
      },
      {
        "id": "104170273276841718",
        "accountId": "5",
        "replyId": "104170273205084988",
        "content": "a1"
      },
      {
        "id": "104170273256426023",
        "accountId": "5",
        "replyId": "104170273237400789",
        "content": "c"
      },
      {
        "id": "104170273298534371",
        "accountId": "5",
        "replyId": "104170273256426023",
        "content": "d"
      },
      {
        "id": "104170273356931049",
        "accountId": "5",
        "replyId": "104170273298534371",
        "content": "e"
      },
      {
        "id": "104170273341388633",
        "accountId": "5",
        "replyId": "104170273237400789",
        "content": "b1"
      },
      {
        "id": "104170273365802755",
        "accountId": "5",
        "replyId": "104170273341388633",
        "content": "b2"
      },
      {
        "id": "104170273331400302",
        "accountId": "5",
        "replyId": "104170273276841718",
        "content": "a2"
      },
      {
        "id": "104170273348336156",
        "accountId": "5",
        "replyId": "104170273331400302",
        "content": "a3"
      },
      {
        "id": "104170273376273045",
        "accountId": "5",
        "replyId": "104170273348336156",
        "content": "a4"
      },
      {
        "id": "104170273388248109",
        "accountId": "5",
        "replyId": "104170273276841718",
        "content": "a1a"
      }
    ]

    const expected = 'a b c d e b1 b2 a1 a2 a3 a4 a1a'.split(' ')

    const sorted = sortItemSummariesForThread(summaries, summaries[0].id)
    const sortedContents = sorted.map(_ => _.content)
    assert.deepEqual(sortedContents, expected)
  })

  it('orders a complex thread correctly - original account involved', () => {
    const summaries = [
      {
        "id": "104170273205084988",
        "accountId": "2",
        "content": "a"
      },
      {
        "id": "104170273237400789",
        "accountId": "5",
        "replyId": "104170273205084988",
        "content": "b"
      },
      {
        "id": "104170273276841718",
        "accountId": "2",
        "replyId": "104170273205084988",
        "content": "a1"
      },
      {
        "id": "104170273256426023",
        "accountId": "5",
        "replyId": "104170273237400789",
        "content": "c"
      },
      {
        "id": "104170273298534371",
        "accountId": "5",
        "replyId": "104170273256426023",
        "content": "d"
      },
      {
        "id": "104170273356931049",
        "accountId": "5",
        "replyId": "104170273298534371",
        "content": "e"
      },
      {
        "id": "104170273341388633",
        "accountId": "5",
        "replyId": "104170273237400789",
        "content": "b1"
      },
      {
        "id": "104170273365802755",
        "accountId": "5",
        "replyId": "104170273341388633",
        "content": "b2"
      },
      {
        "id": "104170273331400302",
        "accountId": "2",
        "replyId": "104170273276841718",
        "content": "a2"
      },
      {
        "id": "104170273348336156",
        "accountId": "2",
        "replyId": "104170273331400302",
        "content": "a3"
      },
      {
        "id": "104170273376273045",
        "accountId": "2",
        "replyId": "104170273348336156",
        "content": "a4"
      },
      {
        "id": "104170273388248109",
        "accountId": "5",
        "replyId": "104170273276841718",
        "content": "a1a"
      }
    ]

    const expected = 'a a1 a2 a3 a4 b c d e b1 b2 a1a'.split(' ')

    const sorted = sortItemSummariesForThread(summaries, summaries[0].id)
    const sortedContents = sorted.map(_ => _.content)
    assert.deepEqual(sortedContents, expected)
  })
})
