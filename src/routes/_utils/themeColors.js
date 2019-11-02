import { themes } from '../_static/themes'
import { fromPairs } from '../_utils/lodash-lite'

export const themeColors = fromPairs(themes.map(({ name, color }) => ([name, color])))
