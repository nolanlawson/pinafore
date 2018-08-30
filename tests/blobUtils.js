export function base64StringToBlob (base64, type) {
  function binaryStringToArrayBuffer (binary) {
    let length = binary.length
    let buf = new ArrayBuffer(length)
    let arr = new Uint8Array(buf)
    let i = -1
    while (++i < length) {
      arr[i] = binary.charCodeAt(i)
    }
    return buf
  }

  let parts = [binaryStringToArrayBuffer(atob(base64))]
  return type ? new Blob(parts, { type: type }) : new Blob(parts)
}
