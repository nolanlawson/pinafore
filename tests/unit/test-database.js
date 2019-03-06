/* global it describe beforeEach afterEach */

import '../indexedDBShims'
import assert from 'assert'
import { closeDatabase, deleteDatabase, getDatabase } from '../../src/routes/_database/databaseLifecycle'
import * as dbApi from '../../src/routes/_database/databaseApis'
import times from 'lodash-es/times'
import cloneDeep from 'lodash-es/cloneDeep'
import {
  TIMESTAMP, ACCOUNT_ID, STATUS_ID, REBLOG_ID, USERNAME_LOWERCASE,
  CURRENT_TIME, DB_VERSION_CURRENT, DB_VERSION_SEARCH_ACCOUNTS, DB_VERSION_SNOWFLAKE_IDS
} from '../../src/routes/_database/constants'
import { cleanup, TIME_AGO } from '../../src/routes/_database/cleanup'

const INSTANCE_NAME = 'localhost:3000'

const INSTANCE_INFO = {
  'uri': 'localhost:3000',
  'title': 'lolcathost',
  'description': 'blah',
  'foo': {
    'bar': true
  }
}

const createStatus = i => ({
  id: i.toString(),
  created_at: new Date().toISOString(),
  content: `Status #4{id}`,
  account: {
    id: '1'
  }
})

const stripDBFields = item => {
  let res = cloneDeep(item)
  delete res[TIMESTAMP]
  delete res[ACCOUNT_ID]
  delete res[STATUS_ID]
  delete res[REBLOG_ID]
  delete res[USERNAME_LOWERCASE]
  if (res.account) {
    delete res.account[TIMESTAMP]
  }
  return res
}

describe('test-database.js', function () {
  this.timeout(60000)

  describe('db-basic', () => {
    beforeEach(async () => {
      await getDatabase(INSTANCE_NAME)
    })

    afterEach(async () => {
      await deleteDatabase(INSTANCE_NAME)
    })

    it('basic indexeddb test', async () => {
      let info = await dbApi.getInstanceInfo(INSTANCE_NAME)
      assert(!info)
      await dbApi.setInstanceInfo(INSTANCE_NAME, INSTANCE_INFO)
      info = await dbApi.getInstanceInfo(INSTANCE_NAME)
      assert.deepStrictEqual(info, INSTANCE_INFO)
    })

    it('basic indexeddb test 2', async () => {
      // sanity check to make sure that we have a clean DB between each test
      let info = await dbApi.getInstanceInfo(INSTANCE_NAME)
      assert(!info)
      await dbApi.setInstanceInfo(INSTANCE_NAME, INSTANCE_INFO)
      info = await dbApi.getInstanceInfo(INSTANCE_NAME)
      assert.deepStrictEqual(info, INSTANCE_INFO)
    })

    it('stores and sorts some statuses', async () => {
      let allStatuses = times(40, createStatus)
      await dbApi.insertTimelineItems(INSTANCE_NAME, 'local', allStatuses)
      let statuses = await dbApi.getTimeline(INSTANCE_NAME, 'local', null, 20)
      let expected = allStatuses.slice().reverse().slice(0, 20)
      assert.deepStrictEqual(statuses.map(stripDBFields), expected)

      statuses = await dbApi.getTimeline(INSTANCE_NAME, 'local', statuses[statuses.length - 1].id, 20)
      expected = allStatuses.slice().reverse().slice(20, 40)
      assert.deepStrictEqual(statuses.map(stripDBFields), expected)
    })

    it('cleans up old statuses', async () => {
      // Pretend we are inserting a status from a long time ago. Note that we
      // set a timestamp based on the *current* date when the status is inserted,
      // not the date that the status was composed.

      let longAgo = Date.now() - (TIME_AGO * 2)

      let oldStatus = {
        id: '1',
        created_at: new Date(longAgo).toISOString(),
        content: 'This is old',
        account: {
          id: '1'
        }
      }

      let previousNow = CURRENT_TIME.now
      CURRENT_TIME.now = () => longAgo

      await dbApi.insertTimelineItems(INSTANCE_NAME, 'local', [oldStatus])

      CURRENT_TIME.now = previousNow

      let newStatus = {
        id: '2',
        created_at: new Date().toISOString(),
        content: 'This is new',
        account: {
          id: '2'
        }
      }

      await dbApi.insertTimelineItems(INSTANCE_NAME, 'local', [newStatus])
      let statuses = await dbApi.getTimeline(INSTANCE_NAME, 'local', null, 20)
      assert.deepStrictEqual(statuses.map(stripDBFields), [newStatus, oldStatus])

      let status1 = await dbApi.getStatus(INSTANCE_NAME, '1')
      let status2 = await dbApi.getStatus(INSTANCE_NAME, '2')

      assert.deepStrictEqual(stripDBFields(status1), oldStatus)
      assert.deepStrictEqual(stripDBFields(status2), newStatus)

      await cleanup(INSTANCE_NAME)

      statuses = await dbApi.getTimeline(INSTANCE_NAME, 'local', null, 20)
      assert.deepStrictEqual(statuses.map(stripDBFields), [newStatus])

      status1 = await dbApi.getStatus(INSTANCE_NAME, '1')
      status2 = await dbApi.getStatus(INSTANCE_NAME, '2')

      assert(!!status1)
      assert.deepStrictEqual(stripDBFields(status2), newStatus)
    })
  })

  describe('db-migrations', () => {
    let oldCurrentVersion

    beforeEach(async () => {
      oldCurrentVersion = DB_VERSION_CURRENT.version
    })

    afterEach(async () => {
      DB_VERSION_CURRENT.version = oldCurrentVersion
      await deleteDatabase(INSTANCE_NAME)
    })

    it('migrates to snowflake IDs', async () => {
      // open the db using the old version
      DB_VERSION_CURRENT.version = DB_VERSION_SEARCH_ACCOUNTS
      await getDatabase(INSTANCE_NAME)

      // insert some statuses
      let allStatuses = times(40, createStatus)
      await dbApi.insertTimelineItems(INSTANCE_NAME, 'local', allStatuses)

      let statuses = await dbApi.getTimeline(INSTANCE_NAME, 'local', null, 1000)
      let expected = allStatuses.slice().reverse()
      assert.deepStrictEqual(statuses.map(stripDBFields), expected)

      // close the database
      closeDatabase(INSTANCE_NAME)

      // do a version upgrade
      DB_VERSION_CURRENT.version = DB_VERSION_SNOWFLAKE_IDS
      await getDatabase(INSTANCE_NAME)

      // check that the old statuses are correct
      statuses = await dbApi.getTimeline(INSTANCE_NAME, 'local', null, 1000)
      expected = allStatuses.slice().reverse()
      assert.deepStrictEqual(statuses.map(stripDBFields), expected)

      // insert some more statuses for good measure
      let moreStatuses = times(20, i => 40 + i).map(createStatus)

      await dbApi.insertTimelineItems(INSTANCE_NAME, 'local', moreStatuses)

      statuses = await dbApi.getTimeline(INSTANCE_NAME, 'local', null, 1000)
      expected = moreStatuses.slice().reverse().concat(allStatuses.reverse())

      assert.deepStrictEqual(statuses.map(stripDBFields), expected)
    })
  })
})
