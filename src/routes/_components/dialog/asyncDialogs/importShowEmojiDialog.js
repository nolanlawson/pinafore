export const importShowEmojiDialog = () => import(
  /* webpackChunkName: 'showEmojiDialog' */ '../creators/showEmojiDialog'
).then(mod => mod.default)
