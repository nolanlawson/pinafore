export const DB_NAME = 'pinafore_development'
export const DB_USER = 'pinafore'
export const DB_PASS = 'pinafore'
export const DB_PORT = process.env.PGPORT || 5432
export const DB_HOST = '127.0.0.1'

export const envFile = `
PAPERCLIP_SECRET=foo
SECRET_KEY_BASE=bar
OTP_SECRET=foobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobar
DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT}
DB_USER=${DB_USER}
DB_NAME=${DB_NAME}
DB_PASS=${DB_PASS}
`

// Need a Ruby version that CircleCI bundles with Node v12, not Node v14 which doesn't
// work for streaming
export const RUBY_VERSION = '2.6.6'
