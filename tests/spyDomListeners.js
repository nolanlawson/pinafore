import { ClientFunction as exec } from 'testcafe'

export const installDomListenerListener = exec(() => {
  function eql (a, b) {
    const aType = typeof a
    const bType = typeof b
    switch (aType) {
      case 'boolean':
        return bType === 'boolean' && b === a
      case 'undefined':
        return bType === 'undefined'
      case 'object':
        if (a === null) {
          return b === null
        }
        if (b === null) {
          return false
        }
        if (Object.keys(a).length !== Object.keys(b).length) {
          return false
        }
        for (const key of Object.keys(a)) {
          if (a[key] !== b[key]) {
            return false
          }
        }
        return true
    }
    return false
  }

  function spyAddListener (proto) {
    const addEventListener = proto.addEventListener
    proto.addEventListener = function (type, listener, options) {
      if (!this.__listeners) {
        this.__listeners = {}
      }
      if (!this.__listeners[type]) {
        this.__listeners[type] = []
      }
      this.__listeners[type].push({ listener, options })
      return addEventListener.apply(this, arguments)
    }
  }

  function spyRemoveListener (proto) {
    const removeEventListener = proto.removeEventListener
    proto.removeEventListener = function (type, listener, options) {
      if (this.__listeners && this.__listeners[type]) {
        const arr = this.__listeners[type]
        for (let i = arr.length - 1; i >= 0; i--) {
          const { listener: otherListener, options: otherOptions } = arr[i]
          if (listener === otherListener && eql(options, otherOptions)) {
            arr.splice(i, 1)
          }
        }
      }
      return removeEventListener.apply(this, arguments)
    }
  }

  function spy (proto) {
    spyAddListener(proto)
    spyRemoveListener(proto)
  }

  spy(Element.prototype)
  spy(document)
  spy(window)
})

export const getNumDomListeners = exec(() => {
  function getNumListeners (obj) {
    let sum = 0
    if (obj.__listeners) {
      for (const key of Object.keys(obj.__listeners)) {
        sum += obj.__listeners[key].length
      }
    }
    return sum
  }

  return [...document.querySelectorAll('*')]
    .concat([window, document])
    .map(getNumListeners)
    .reduce((a, b) => a + b, 0)
})
