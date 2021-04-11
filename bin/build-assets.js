import path from 'path'
import fs from 'fs'
import { promisify } from 'util'
import { LOCALE } from '../src/routes/_static/intl'
import { getIntl, trimWhitespace } from './getIntl'

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

// Try 'en-US' first, then 'en' if that doesn't exist
const PREFERRED_LOCALES = [LOCALE, LOCALE.split('-')[0]]

// emojibase seems like the most "neutral" shortcodes, but cldr is available in every language
const PREFERRED_SHORTCODES = ['emojibase', 'cldr']

async function getEmojiI18nFile (locale, shortcode) {
  const filename = path.resolve(__dirname,
    '../node_modules/emoji-picker-element-data',
    locale,
    shortcode,
    'data.json')
  try {
    return JSON.parse(await readFile(filename, 'utf8'))
  } catch (err) { /* ignore */ }
}

async function getFirstExistingEmojiI18nFile () {
  for (const locale of PREFERRED_LOCALES) {
    for (const shortcode of PREFERRED_SHORTCODES) {
      const json = await getEmojiI18nFile(locale, shortcode)
      if (json) {
        return json
      }
    }
  }
}

async function buildEmojiI18nFile () {
  const json = await getFirstExistingEmojiI18nFile()

  if (!json) {
    throw new Error(`Couldn't find i18n data for locale ${LOCALE}. Is it supported in emoji-picker-element-data?`)
  }

  await writeFile(
    path.resolve(__dirname, `../static/emoji-${LOCALE}.json`),
    JSON.stringify(json),
    'utf8'
  )
}

async function buildManifestJson () {
  const template = await readFile(path.resolve(__dirname, '../src/build/manifest.json'), 'utf8')
  // replace {@intl.foo}
  const output = template
    .replace(/{intl\.([^}]+)}/g, (match, p1) => trimWhitespace(getIntl(p1)))

  await writeFile(
    path.resolve(__dirname, '../static/manifest.json'),
    JSON.stringify(JSON.parse(output)), // minify json
    'utf8'
  )
}

async function main () {
  await Promise.all([
    buildEmojiI18nFile(),
    buildManifestJson()
  ])
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
