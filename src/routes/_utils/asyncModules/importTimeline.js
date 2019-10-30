export const importTimeline = () => import(
  /* webpackChunkName: 'Timeline' */ '../../_components/timeline/Timeline.html'
).then(mod => mod.default)
