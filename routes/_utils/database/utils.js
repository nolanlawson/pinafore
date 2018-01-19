import cloneDeep from 'lodash/cloneDeep'
import padStart from 'lodash/padStart'

export function toPaddedBigInt (id) {
  return padStart(id, 30, '0')
}

export function toReversePaddedBigInt (id) {
  let bigInt = toPaddedBigInt(id)
  let res = ''
  for (let i = 0; i < bigInt.length; i++) {
    res += (9 - parseInt(bigInt.charAt(i), 10)).toString(10)
  }
  return res
}

export function transformStatusForStorage (status) {
  status = cloneDeep(status)
  status.pinafore_id_as_negative_big_int = toReversePaddedBigInt(status.id)
  status.pinafore_stale = true
  return status
}