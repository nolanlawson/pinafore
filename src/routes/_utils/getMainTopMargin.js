// should be kept in sync with global.scss
export function getMainTopMargin () {
  if (matchMedia('(max-width: 767px)').matches) {
    return 62
  } else if (matchMedia('(max-width: 991px').matches) {
    return 52
  } else {
    return 42
  }
}
