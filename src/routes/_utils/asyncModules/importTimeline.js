export const importTimeline = () => import(
  '../../_components/timeline/Timeline.html'
).then(mod => mod.default)
