// modeled after https://github.com/andrewiggins/afterframe
// see also https://github.com/WICG/requestPostAnimationFrame
export const requestPostAnimationFrame = cb => {
  requestAnimationFrame(() => {
    const channel = new MessageChannel()
    channel.port1.onmessage = cb
    channel.port2.postMessage(undefined)
  })
}
