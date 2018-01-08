// from blob-util
function blobToBinaryString(blob) {
  return new Promise(function (resolve, reject) {
    var reader = new FileReader();
    var hasBinaryString = typeof reader.readAsBinaryString === 'function';
    reader.onloadend = function (e) {
      var result = e.target.result || '';
      if (hasBinaryString) {
        return resolve(result);
      }
      resolve(arrayBufferToBinaryString(result));
    };
    reader.onerror = reject;
    if (hasBinaryString) {
      reader.readAsBinaryString(blob);
    } else {
      reader.readAsArrayBuffer(blob);
    }
  });
}

export function blobToBase64(blob) {
  return blobToBinaryString(blob).then(function (binary) {
    // web-safe variant
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  });
}