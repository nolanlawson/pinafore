export const importEmojiMart = () => import(
  /* webpackChunkName: 'createEmojiMartPickerFromData.js' */ '../../_react/createEmojiMartPickerFromData.js'
).then(mod => mod.default)
