const getDefault = mod => mod.default

export const importShowAccountProfileOptionsDialog = () => import(
  /* webpackChunkName: 'showAccountProfileOptionsDialog' */ './creators/showAccountProfileOptionsDialog'
  ).then(getDefault)

export const importShowComposeDialog = () => import(
  /* webpackChunkName: 'showComposeDialog' */ './creators/showComposeDialog'
  ).then(getDefault)

export const importShowConfirmationDialog = () => import(
  /* webpackChunkName: 'showConfirmationDialog' */ './creators/showConfirmationDialog'
  ).then(getDefault)

export const importShowEmojiDialog = () => import(
  /* webpackChunkName: 'showEmojiDialog' */ './creators/showEmojiDialog'
  ).then(getDefault)

export const importShowPostPrivacyDialog = () => import(
  /* webpackChunkName: 'showPostPrivacyDialog' */ './creators/showPostPrivacyDialog'
  ).then(getDefault)

export const importShowStatusOptionsDialog = () => import(
  /* webpackChunkName: 'showStatusOptionsDialog' */ './creators/showStatusOptionsDialog'
  ).then(getDefault)

export const importShowCopyDialog = () => import(
  /* webpackChunkName: 'showCopyDialog' */ './creators/showCopyDialog'
  ).then(getDefault)

export const importShowShortcutHelpDialog = () => import(
  /* webpackChunkName: 'showShortcutHelpDialog' */ './creators/showShortcutHelpDialog'
  ).then(getDefault)

export const importShowMediaDialog = () => import(
  /* webpackChunkName: 'showMediaDialog' */ './creators/showMediaDialog'
  ).then(getDefault)
