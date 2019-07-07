// via https://github.com/bfred-it/intrinsic-scale/blob/3d058f79902653484092ad9a2f3e1d9a3d03f09e/index.js

export const intrinsicScale = (parentWidth, parentHeight, childWidth, childHeight) => {
  const doRatio = childWidth / childHeight
  const cRatio = parentWidth / parentHeight
  let width = parentWidth
  let height = parentHeight

  if (doRatio > cRatio) {
    height = width / doRatio
  } else {
    width = height * doRatio
  }

  return {
    width,
    height,
    x: (parentWidth - width) / 2,
    y: (parentHeight - height) / 2
  }
}
