import path from 'path'

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
BIND=0.0.0.0
`

export const GIT_URL = 'https://github.com/tootsuite/mastodon.git'
export const GIT_TAG = 'v4.0.2'

export const RUBY_VERSION = '3.0.4'

const __dirname = path.dirname(new URL(import.meta.url).pathname)
export const mastodonDir = path.join(__dirname, '../mastodon')

export const env = Object.assign({}, process.env, {
  RAILS_ENV: 'development',
  NODE_ENV: 'development',
  BUNDLE_PATH: path.join(mastodonDir, 'vendor/bundle'),
  DB_NAME,
  DB_USER,
  DB_PASS,
  DB_HOST,
  DB_PORT
})
