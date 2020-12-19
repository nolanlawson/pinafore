import { LOCALE } from './intl'

export const emojiPickerDataSource = `/emoji-${LOCALE}.json`

// this should be undefined for English; it's already bundled with emoji-picker-element
export const emojiPickerI18n = process.env.EMOJI_PICKER_I18N

// To avoid creating a new IDB database named emoji-picker-en-US, just
// reuse the existing default "en" one (otherwise people will end up with
// a stale database taking up useless space)
export const emojiPickerLocale = LOCALE === 'en-US' ? 'en' : LOCALE
