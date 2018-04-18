const TIMEOUT = process.browser ? 60000 : 120000

function fetchWithTimeout (url, options) {
  return new Promise((resolve, reject) => {
    fetch(url, options).then(resolve, reject)
    setTimeout(() => reject(new Error(`Timed out after ${TIMEOUT / 1000} seconds`)), TIMEOUT)
  })
}

function makeOpts (method, headers) {
  return {
    method: 'GET',
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

async function _fetch (url, options, timeout) {
  let fetchFunc = timeout ? fetchWithTimeout : fetch
  let response = await fetchFunc(url, options)
  return throwErrorIfInvalidResponse(response)
}

async function _putOrPost (url, body, headers, timeout, method) {
  let opts = makeOpts(method, headers)
  if (body) {
    if (body instanceof FormData) {
      opts.body = body
    } else {
      opts.body = JSON.stringify(body)
      opts.headers['Content-Type'] = 'application/json'
    }
  }
  return _fetch(url, opts, timeout)
}

async function _post (url, body, headers, timeout) {
  return _putOrPost(url, body, headers, timeout, 'POST')
}

async function _put (url, body, headers, timeout) {
  return _putOrPost(url, body, headers, timeout, 'PUT')
}

async function _get (url, headers, timeout) {
  return _fetch(url, makeOpts('GET', headers), timeout)
}

async function _delete (url, headers, timeout) {
  return _fetch(url, makeOpts('DELETE', headers), timeout)
}

export async function put (url, body, headers) {
  return _put(url, body, headers, false)
}

export async function putWithTimeout (url, body, headers) {
  return _put(url, body, headers, true)
}

export async function post (url, body, headers) {
  return _post(url, body, headers, false)
}

export async function postWithTimeout (url, body, headers) {
  return _post(url, body, headers, true)
}

export async function getWithTimeout (url, headers) {
  return _get(url, headers, true)
}

export async function get (url, headers) {
  return _get(url, headers, false)
}

export async function deleteWithTimeout (url, headers) {
  return _delete(url, headers, true)
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
