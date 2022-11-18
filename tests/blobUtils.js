export function base64StringToBlob (base64, type) {
  function binaryStringToArrayBuffer (binary) {
    const length = binary.length
    const buf = new ArrayBuffer(length)
    const arr = new Uint8Array(buf)
    let i = -1
    while (++i < length) {
      arr[i] = binary.charCodeAt(i)
    }
    return buf
  }

  const parts = [binaryStringToArrayBuffer(atob(base64))]
  return type ? new Blob(parts, { type }) : new Blob(parts)
}
