import { loggedInComputations } from './computations/loggedInComputations'
import { loggedInObservers } from './observers/loggedInObservers'
import { loggedInMixins } from './mixins/loggedInMixins'

console.log('imported logged in observers and computations')
loggedInMixins()
loggedInComputations()
loggedInObservers()
