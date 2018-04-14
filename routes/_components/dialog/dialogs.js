export async function importShowAccountProfileOptionsDialog () {
  return (await import(
    /* webpackChunkName: 'showAccountProfileOptionsDialog.js' */
    './creators/showAccountProfileOptionsDialog.js'
  )).default
}

export async function importShowComposeDialog () {
  return (await import(
    /* webpackChunkName: 'showComposeDialog.js' */
    './creators/showComposeDialog.js'
  )).default
}

export async function importShowConfirmationDialog () {
  return (await import(
    /* webpackChunkName: 'showConfirmationDialog.js' */
    './creators/showConfirmationDialog.js'
  )).default
}

export async function importShowEmojiDialog () {
  return (await import(
    /* webpackChunkName: 'showEmojiDialog.js' */
    './creators/showEmojiDialog.js'
  )).default
}

export async function importShowImageDialog () {
  return (await import(
    /* webpackChunkName: 'showImageDialog.js' */
    './creators/showImageDialog.js'
  )).default
}

export async function importShowPostPrivacyDialog () {
  return (await import(
    /* webpackChunkName: 'showPostPrivacyDialog.js' */
    './creators/showPostPrivacyDialog.js'
  )).default
}

export async function importShowStatusOptionsDialog () {
  return (await import(
    /* webpackChunkName: 'showStatusOptionsDialog.js' */
    './creators/showStatusOptionsDialog.js'
  )).default
}

export async function importShowVideoDialog () {
  return (await import(
    /* webpackChunkName: 'showVideoDialog.js' */
    './creators/showVideoDialog.js'
  )).default
}