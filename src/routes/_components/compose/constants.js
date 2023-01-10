export const STATUSES_STORE = 'statuses-v4'
export const STATUS_TIMELINES_STORE = 'status_timelines-v4'
export const META_STORE = 'meta-v4'
export const ACCOUNTS_STORE = 'accounts-v4'
export const RELATIONSHIPS_STORE = 'relationships-v4'
export const NOTIFICATIONS_STORE = 'notifications-v4'
export const NOTIFICATION_TIMELINES_STORE = 'notification_timelines-v4'
export const PINNED_STATUSES_STORE = 'pinned_statuses-v4'
export const THREADS_STORE = 'threads-v4'

export const TIMESTAMP = '__semaphore_ts'
export const ACCOUNT_ID = '__semaphore_acct_id'
export const STATUS_ID = '__semaphore_status_id'
export const REBLOG_ID = '__semaphore_reblog_id'
export const USERNAME_LOWERCASE = '__semaphore_acct_lc'

export const DB_VERSION_INITIAL = 9
export const DB_VERSION_SEARCH_ACCOUNTS = 10
export const DB_VERSION_SNOWFLAKE_IDS = 12 // 11 skipped because of mistake deployed to dev.semaphore.social

// Using an object for these so that unit tests can change them
export const DB_VERSION_CURRENT = { version: 12 }
export const CURRENT_TIME = { now: () => Date.now() }
