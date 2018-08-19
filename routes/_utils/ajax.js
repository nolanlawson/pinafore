export const DEFAULT_TIMEOUT = 20000
export const MEDIA_WRITE_TIMEOUT = 90000 // media uploads can take awhile
export const WRITE_TIMEOUT = 45000 // allow more time if the user did a write action

function fetchWithTimeout (url, fetchOptions, timeout) {
  return new Promise((resolve, reject) => {
    fetch(url, fetchOptions).then(resolve, reject)
    setTimeout(() => reject(new Error(`Timed out after ${timeout / 1000} seconds`)), timeout)
  })
}

function makeFetchOptions (method, headers) {
  return {
    method,
    headers: Object.assign(headers || {}, {
      'Accept': 'application/json'
    })
  }
}

async function throwErrorIfInvalidResponse (response) {
  let json = await response.json()
  if (response.status >= 200 && response.status < 300) {
    return json
  }
  if (json && json.error) {
    throw new Error(response.status + ': ' + json.error)
  }
  throw new Error('Request failed: ' + response.status)
}

async function _fetch (url, fetchOptions, options) {
  let response
  if (options && options.timeout) {
    response = await fetchWithTimeout(url, fetchOptions, options.timeout)
  } else {
    response = await fetch(url, fetchOptions)
  }
  return throwErrorIfInvalidResponse(response)
}

async function _putOrPostOrPatch (method, url, body, headers, options) {
  let fetchOptions = makeFetchOptions(method, headers)
  if (body) {
    if (body instanceof FormData) {
      fetchOptions.body = body
    } else {
      fetchOptions.body = JSON.stringify(body)
      fetchOptions.headers['Content-Type'] = 'application/json'
    }
  }
  return _fetch(url, fetchOptions, options)
}

export async function put (url, body, headers, options) {
  return _putOrPostOrPatch('PUT', url, body, headers, options)
}

export async function post (url, body, headers, options) {
  return _putOrPostOrPatch('POST', url, body, headers, options)
}

export async function patch (url, body, headers, options) {
  return _putOrPostOrPatch('PATCH', url, body, headers, options)
}

export async function get (url, headers, options) {
  return _fetch(url, makeFetchOptions('GET', headers), options)
}

export async function del (url, headers, options) {
  return _fetch(url, makeFetchOptions('DELETE', headers), options)
}

export function paramsString (paramsObject) {
  let res = ''
  Object.keys(paramsObject).forEach((key, i) => {
    if (i > 0) {
      res += '&'
    }
    res += encodeURIComponent(key) + '=' + encodeURIComponent(paramsObject[key])
  })
  return res
}
