/* global describe, it */
import assert from 'assert'
import { sortItemSummariesForThread } from '../../src/routes/_utils/sortItemSummariesForThread'

describe('test-thread-ordering.js', () => {
  it('orders a complex thread correctly', () => {
    const summaries = [
      {
        id: '104170273205084988',
        accountId: '2',
        content: 'a'
      },
      {
        id: '104170273237400789',
        accountId: '5',
        replyId: '104170273205084988',
        content: 'b'
      },
      {
        id: '104170273276841718',
        accountId: '5',
        replyId: '104170273205084988',
        content: 'a1'
      },
      {
        id: '104170273256426023',
        accountId: '5',
        replyId: '104170273237400789',
        content: 'c'
      },
      {
        id: '104170273298534371',
        accountId: '5',
        replyId: '104170273256426023',
        content: 'd'
      },
      {
        id: '104170273356931049',
        accountId: '5',
        replyId: '104170273298534371',
        content: 'e'
      },
      {
        id: '104170273341388633',
        accountId: '5',
        replyId: '104170273237400789',
        content: 'b1'
      },
      {
        id: '104170273365802755',
        accountId: '5',
        replyId: '104170273341388633',
        content: 'b2'
      },
      {
        id: '104170273331400302',
        accountId: '5',
        replyId: '104170273276841718',
        content: 'a2'
      },
      {
        id: '104170273348336156',
        accountId: '5',
        replyId: '104170273331400302',
        content: 'a3'
      },
      {
        id: '104170273376273045',
        accountId: '5',
        replyId: '104170273348336156',
        content: 'a4'
      },
      {
        id: '104170273388248109',
        accountId: '5',
        replyId: '104170273276841718',
        content: 'a1a'
      }
    ]

    const expected = 'a b c d e b1 b2 a1 a2 a3 a4 a1a'.split(' ')

    const sorted = sortItemSummariesForThread(summaries, summaries[0].id)
    const sortedContents = sorted.map(_ => _.content)
    assert.deepStrictEqual(sortedContents, expected)
  })

  it('orders a complex thread correctly - original account involved', () => {
    const summaries = [
      {
        id: '104170273205084988',
        accountId: '2',
        content: 'a'
      },
      {
        id: '104170273237400789',
        accountId: '5',
        replyId: '104170273205084988',
        content: 'b'
      },
      {
        id: '104170273276841718',
        accountId: '2',
        replyId: '104170273205084988',
        content: 'a1'
      },
      {
        id: '104170273256426023',
        accountId: '5',
        replyId: '104170273237400789',
        content: 'c'
      },
      {
        id: '104170273298534371',
        accountId: '5',
        replyId: '104170273256426023',
        content: 'd'
      },
      {
        id: '104170273356931049',
        accountId: '5',
        replyId: '104170273298534371',
        content: 'e'
      },
      {
        id: '104170273341388633',
        accountId: '5',
        replyId: '104170273237400789',
        content: 'b1'
      },
      {
        id: '104170273365802755',
        accountId: '5',
        replyId: '104170273341388633',
        content: 'b2'
      },
      {
        id: '104170273331400302',
        accountId: '2',
        replyId: '104170273276841718',
        content: 'a2'
      },
      {
        id: '104170273348336156',
        accountId: '2',
        replyId: '104170273331400302',
        content: 'a3'
      },
      {
        id: '104170273376273045',
        accountId: '2',
        replyId: '104170273348336156',
        content: 'a4'
      },
      {
        id: '104170273388248109',
        accountId: '5',
        replyId: '104170273276841718',
        content: 'a1a'
      }
    ]

    const expected = 'a a1 a2 a3 a4 b c d e b1 b2 a1a'.split(' ')

    const sorted = sortItemSummariesForThread(summaries, summaries[0].id)
    const sortedContents = sorted.map(_ => _.content)
    assert.deepStrictEqual(sortedContents, expected)
  })

  it('complex thread is in correct order - with mixed self-replies 2', () => {
    const summaries = [{
      id: '104176454386581622',
      accountId: '2',
      content: 'a'
    }, {
      id: '104176454485378729',
      accountId: '2',
      replyId: '104176454386581622',
      content: 'foobar-mixed1'
    }, {
      id: '104176454515584245',
      accountId: '2',
      replyId: '104176454386581622',
      content: 'foobar-mixed1a'
    }, {
      id: '104176454522882883',
      accountId: '2',
      replyId: '104176454386581622',
      content: 'foobar-mixed1b'
    }, {
      id: '104176454396619534',
      accountId: '5',
      replyId: '104176454386581622',
      content: 'b'
    }, {
      id: '104176454413613662',
      accountId: '5',
      replyId: '104176454386581622',
      content: 'a1'
    }, {
      id: '104176454529610049',
      accountId: '2',
      replyId: '104176454485378729',
      content: 'foobar-mixed2a'
    }, {
      id: '104176454403991688',
      accountId: '5',
      replyId: '104176454396619534',
      content: 'c'
    }, {
      id: '104176454422082616',
      accountId: '5',
      replyId: '104176454403991688',
      content: 'd'
    }, {
      id: '104176454453810927',
      accountId: '5',
      replyId: '104176454422082616',
      content: 'e'
    }, {
      id: '104176454437136977',
      accountId: '5',
      replyId: '104176454396619534',
      content: 'b1'
    }, {
      id: '104176454461082666',
      accountId: '5',
      replyId: '104176454437136977',
      content: 'b2'
    }, {
      id: '104176454429382434',
      accountId: '5',
      replyId: '104176454413613662',
      content: 'a2'
    }, {
      id: '104176454446265415',
      accountId: '5',
      replyId: '104176454429382434',
      content: 'a3'
    }, {
      id: '104176454468322929',
      accountId: '5',
      replyId: '104176454446265415',
      content: 'a4'
    }, {
      id: '104176454477242935',
      accountId: '5',
      replyId: '104176454413613662',
      content: 'a1a'
    }, {
      id: '104176454493347083',
      accountId: '5',
      replyId: '104176454485378729',
      content: 'baz-mixed2'
    }, {
      id: '104176454500705115',
      accountId: '2',
      replyId: '104176454493347083',
      content: 'foobar-mixed3'
    }, {
      id: '104176454508488937',
      accountId: '2',
      replyId: '104176454500705115',
      content: 'foobar-mixed4'
    }]

    const expected = ('a foobar-mixed1 foobar-mixed2a foobar-mixed1a foobar-mixed1b ' +
      'b c d e b1 b2 a1 a2 a3 a4 a1a baz-mixed2 foobar-mixed3 foobar-mixed4').split(' ')

    const sorted = sortItemSummariesForThread(summaries, summaries[0].id)
    const sortedContents = sorted.map(_ => _.content)
    assert.deepStrictEqual(sortedContents, expected)
  })

  it('orders another complex thread correctly', () => {
    const summaries = [{
      id: '104179325085424124',
      accountId: '2',
      content: 'this-is-my-thread-1'
    }, {
      id: '104179325166234979',
      accountId: '2',
      replyId: '104179325085424124',
      content: 'this-is-my-thread-2'
    }, {
      id: '104179325240180153',
      accountId: '2',
      replyId: '104179325166234979',
      content: 'this-is-my-thread-3'
    }, {
      id: '104179325498778701',
      accountId: '2',
      replyId: '104179325240180153',
      content: 'this-is-my-thread-4'
    }, {
      id: '104179325543709477',
      accountId: '2',
      replyId: '104179325498778701',
      content: 'this-is-my-thread-5'
    }, {
      id: '104179325275861201',
      accountId: '1',
      replyId: '104179325240180153',
      content: 'hey-i-am-replying-to-3'
    }, {
      id: '104179325263377436',
      accountId: '3',
      replyId: '104179325085424124',
      content: 'hey-i-am-replying-to-1'
    }, {
      id: '104179325387035947',
      accountId: '3',
      replyId: '104179325085424124',
      content: 'hey-check-this-reply'
    }, {
      id: '104179325564606101',
      accountId: '1',
      replyId: '104179325085424124',
      content: 'hey-i-am-replying-to-1-again'
    }]

    const expected = [
      'this-is-my-thread-1',
      'this-is-my-thread-2',
      'this-is-my-thread-3',
      'this-is-my-thread-4',
      'this-is-my-thread-5',
      'hey-i-am-replying-to-3',
      'hey-i-am-replying-to-1',
      'hey-check-this-reply',
      'hey-i-am-replying-to-1-again'
    ]

    const sorted = sortItemSummariesForThread(summaries, summaries[0].id)
    const sortedContents = sorted.map(_ => _.content)
    assert.deepStrictEqual(sortedContents, expected)
  })
})
