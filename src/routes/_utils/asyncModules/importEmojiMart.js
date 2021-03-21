export const importEmojiMart = () => import(
  '../../_react/createEmojiMartPickerFromData.js'
).then(mod => mod.default)
